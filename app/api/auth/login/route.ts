import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/jwt'
import { dbService } from '@/lib/db/mongodb'
import { SecuritySanitizer } from '@/lib/security/sanitizer'
import { ErrorLogger, ErrorType } from '@/lib/logging/logger'

// Ensure this route is dynamic
export const dynamic = 'force-dynamic'

// Simple rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  if (!attempts || now - attempts.lastAttempt > 300000) { // 5 minutes
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }
  
  if (attempts.count >= 5) { // Max 5 attempts per 5 minutes
    return false
  }
  
  attempts.count++
  attempts.lastAttempt = now
  return true
}

export async function POST(request: NextRequest) {
  const clientIp = request.ip || 'unknown'
  let email: string = ''
  
  try {
    // Rate limiting
    if (!checkLoginRateLimit(clientIp)) {
      ErrorLogger.log(
        new Error('Login rate limit exceeded'),
        ErrorType.VALIDATION,
        { ip: clientIp, timestamp: new Date().toISOString() }
      )
      return NextResponse.json({
        success: false,
        error: 'Too many login attempts. Please try again later.'
      }, { status: 429 })
    }
    
    const requestData = await request.json()
    const { email: rawEmail, password } = requestData
    
    // Input validation and sanitization
    if (!rawEmail || !password || typeof rawEmail !== 'string' || typeof password !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }
    
    email = SecuritySanitizer.sanitizeEmail(rawEmail)
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Find user in database
    const user = await dbService.findUserByEmail(email)
    if (!user || !user.password) {
      // Log failed login attempt
      ErrorLogger.log(
        new Error('Login attempt with non-existent email'),
        ErrorType.VALIDATION,
        { email, ip: clientIp, timestamp: new Date().toISOString() }
      )
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await authService.comparePassword(password, user.password)
    if (!isValidPassword) {
      // Log failed password attempt
      ErrorLogger.log(
        new Error('Login attempt with invalid password'),
        ErrorType.VALIDATION,
        { email, ip: clientIp, userId: user._id?.toString(), timestamp: new Date().toISOString() }
      )
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Generate token pair
    const tokens = authService.generateTokenPair({
      userId: user._id.toString(),
      email: user.email!,
      role: user.role!
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ...tokens
    })

    // Set access token as httpOnly cookie
    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    // Log successful login
    ErrorLogger.log(
      new Error('Successful login'),
      ErrorType.INFO,
      { 
        email, 
        ip: clientIp, 
        userId: user._id?.toString(), 
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    )
    
    return response
  } catch (error) {
    // Log detailed error information
    ErrorLogger.log(
      error instanceof Error ? error : new Error('Unknown login error'),
      ErrorType.SERVER_ERROR,
      {
        email: email || 'unknown',
        ip: clientIp,
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    )
    
    return NextResponse.json({
      success: false,
      error: 'Login failed. Please try again later.'
    }, { status: 500 })
  }
}