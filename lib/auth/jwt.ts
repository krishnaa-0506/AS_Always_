import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

// Security: Require JWT secrets to be explicitly set
// During build time, allow undefined secrets (they'll be validated at runtime)
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Only validate JWT secrets at runtime, not during build
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be defined and at least 32 characters long')
  }
}
const JWT_SECRET_JOSE = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null

const REFRESH_SECRET = process.env.REFRESH_SECRET
// Only validate refresh secret at runtime, not during build
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  if (!REFRESH_SECRET || REFRESH_SECRET.length < 32) {
    throw new Error('REFRESH_SECRET must be defined and at least 32 characters long')
  }
}
const REFRESH_SECRET_JOSE = REFRESH_SECRET ? new TextEncoder().encode(REFRESH_SECRET) : null

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export class AuthService {
  // Generate JWT token
  generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
    return jwt.sign(payload as any, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any)
  }

  // Verify JWT token (jose-compatible for edge runtime)
  async verifyTokenJose(token: string): Promise<JWTPayload | null> {
    try {
      if (!JWT_SECRET_JOSE) return null
      const { payload } = await jwtVerify(token, JWT_SECRET_JOSE)
      return payload as unknown as JWTPayload
    } catch (error) {
      return null
    }
  }

  // Generate token using jose (edge-runtime compatible)
  async generateTokenJose(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    if (!JWT_SECRET_JOSE) throw new Error('JWT_SECRET not configured')
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + (7 * 24 * 60 * 60) // 7 days
    
    return await new SignJWT({ ...payload, iat, exp })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(JWT_SECRET_JOSE)
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Compare password
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Extract token from request
  extractTokenFromRequest(request: NextRequest): string | null {
    // First try Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      if (this.isValidToken(token)) {
        return token
      }
    }

    // Then try cookies
    const tokenCookie = request.cookies.get('auth-token')
    if (tokenCookie && this.isValidToken(tokenCookie.value)) {
      return tokenCookie.value
    }

    return null
  }

  // Validate token format
  private isValidToken(token: string): boolean {
    return token.split('.').length === 3 // Basic JWT format check
  }

  // Middleware to verify authentication
  async authenticateRequest(request: NextRequest): Promise<JWTPayload | null> {
    const token = this.extractTokenFromRequest(request)
    if (!token) {
      return null
    }

    return this.verifyToken(token)
  }

  // Verify JWT token (for server runtime)
  async verifyToken(token: string): Promise<JWTPayload | null> {
    return this.verifyTokenJose(token)
  }

  // Generate token pair with refresh token
  generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): { accessToken: string, refreshToken: string } {
    if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
    const accessToken = this.generateToken(payload)
    const refreshToken = jwt.sign(
      { userId: payload.userId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    return { accessToken, refreshToken }
  }

  // Generate refresh token
  generateRefreshToken(userId: string): string {
    if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
    return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' })
  }

  // Secure logout - create response with cleared cookies
  createLogoutResponse(): NextResponse {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    
    // Clear all auth-related cookies
    response.cookies.set('accessToken', '', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/'
    })
    
    response.cookies.set('refreshToken', '', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', 
      expires: new Date(0),
      path: '/'
    })
    
    return response
  }

  // Verify refresh token
  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      if (!JWT_SECRET) return null
      const payload = jwt.verify(token, JWT_SECRET) as any
      if (payload.type === 'refresh') {
        return { userId: payload.userId }
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> {
    const payload = this.verifyRefreshToken(refreshToken)
    if (!payload) return null

    // Get user from database to ensure they still exist
    const { dbService } = await import('../db/mongodb')
    const user = await dbService.findUserById(payload.userId)
    if (!user) return null

    return this.generateTokenPair({
      userId: user._id!.toString(),
      email: user.email!,
      role: user.role
    })
  }

  // Generate password reset token
  generateResetToken(email: string): string {
    if (!JWT_SECRET) throw new Error('JWT_SECRET not configured')
    return jwt.sign({ email, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' })
  }

  // Verify password reset token
  verifyResetToken(token: string): { email: string } | null {
    try {
      if (!JWT_SECRET) return null
      const payload = jwt.verify(token, JWT_SECRET) as any
      if (payload.type === 'reset') {
        return { email: payload.email }
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Generate random code for admin access
  generateAdminCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // Validate admin secret code
  validateAdminCode(code: string): boolean {
    const adminCode = process.env.ADMIN_SECRET_CODE
    if (!adminCode) {
      console.error('ADMIN_SECRET_CODE not configured')
      return false
    }
    return code === adminCode
  }
}

export const authService = new AuthService()

// Auth middleware for API routes
export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await authService.authenticateRequest(request)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Add user to request context
    ;(request as any).user = user
    return handler(request, ...args)
  }
}

// Admin auth middleware
export function withAdminAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await authService.authenticateRequest(request)
    if (!user || user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    ;(request as any).user = user
    return handler(request, ...args)
  }
}