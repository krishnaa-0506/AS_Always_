import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/jwt'

// Ensure this route is dynamic (uses cookies)
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Security: Check for suspicious refresh attempts
    const userAgent = request.headers.get('user-agent')
    const origin = request.headers.get('origin')
    
    if (!userAgent || !origin) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request'
      }, { status: 400 })
    }
    
    const refreshToken = request.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        error: 'No refresh token provided'
      }, { status: 401 })
    }

    // Refresh the access token
    const tokens = await authService.refreshAccessToken(refreshToken)
    
    if (!tokens) {
      return NextResponse.json({
        success: false,
        error: 'Invalid refresh token'
      }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      accessToken: tokens.accessToken
    })

    // Set new refresh token as httpOnly cookie with security flags
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })
    
    // Set access token as httpOnly cookie as well
    response.cookies.set('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({
      success: false,
      error: 'Token refresh failed'
    }, { status: 500 })
  }
}