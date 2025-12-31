import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/jwt'
import { dbService } from '@/lib/db/mongodb'
import { emailService } from '@/lib/email/emailService'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'SENDER' } = await request.json()
    
    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email, password, and name are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid email address'
      }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await dbService.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email already exists'
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password)

    // Create user
    const user = await dbService.createUser({
      email,
      name,
      role: role as 'SENDER' | 'RECEIVER' | 'ADMIN',
      password: hashedPassword
    })

    // Generate token pair
    const tokens = authService.generateTokenPair({
      userId: user._id!.toString(),
      email: user.email!,
      role: user.role
    })

    // Send welcome email (don't wait for it)
    // emailService.sendWelcomeEmail(email, name).catch(err => 
    //   console.error('Welcome email failed:', err)
    // )

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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      error: 'Registration failed'
    }, { status: 500 })
  }
}