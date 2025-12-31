import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export class CSRFProtection {
  private static readonly CSRF_HEADER = 'x-csrf-token'
  private static readonly CSRF_COOKIE = 'csrf-token'

  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static validateToken(request: NextRequest): boolean {
    const headerToken = request.headers.get(this.CSRF_HEADER)
    const cookieToken = request.cookies.get(this.CSRF_COOKIE)?.value
    
    return !!(headerToken && cookieToken && headerToken === cookieToken)
  }

  static addTokenToResponse(response: NextResponse, token: string): NextResponse {
    response.cookies.set(this.CSRF_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return response
  }
}