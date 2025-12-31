import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { authService } from '@/lib/auth/jwt'
import { SecuritySanitizer } from '@/lib/security/sanitizer'
import crypto from 'crypto'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/google`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    // Generate OAuth state token for CSRF protection
    const stateToken = crypto.randomBytes(32).toString('hex')
    
    // Debug logging
    console.log('Google OAuth Debug:')
    console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID)
    console.log('REDIRECT_URI:', REDIRECT_URI)
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
    console.log('Generated state token:', stateToken)
    
    // Redirect to Google OAuth with state parameter
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `state=${stateToken}`

    console.log('Generated Google Auth URL:', googleAuthUrl)

    const response = NextResponse.redirect(googleAuthUrl)
    response.cookies.set('oauth_state', stateToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for OAuth compatibility
      maxAge: 600 // 10 minutes
    })
    return response
  }

  // Validate OAuth state for CSRF protection
  const storedState = request.cookies.get('oauth_state')?.value
  console.log('OAuth callback - received state:', state)
  console.log('OAuth callback - stored state:', storedState)
  
  if (!state || !storedState || state !== storedState) {
    console.error('CSRF validation failed:', { 
      receivedState: state, 
      storedState: storedState,
      stateExists: !!state,
      storedStateExists: !!storedState,
      statesMatch: state === storedState
    })
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth?error=csrf_failed`)
  }

  try {
    console.log('Starting token exchange with Google...')
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()
    console.log('Token exchange successful, fetching user info...')

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch user info from Google')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth?error=user_info_failed`)
    }

    const googleUser = await userResponse.json()
    console.log('Google user info received:', { email: googleUser.email, name: googleUser.name })

    // Sanitize user data from Google
    const sanitizedEmail = SecuritySanitizer.sanitizeString(googleUser.email)
    const sanitizedName = SecuritySanitizer.sanitizeString(googleUser.name)

    // Check if user exists
    let user = await dbService.findUserByEmail(sanitizedEmail)

    if (!user) {
      console.log('Creating new user for:', sanitizedEmail)
      // Create new user
      user = await dbService.createUser({
        email: sanitizedEmail,
        name: sanitizedName,
        role: 'SENDER'
      })
    } else {
      console.log('Existing user found:', sanitizedEmail)
    }

    // Generate JWT tokens
    const accessToken = authService.generateToken({
      userId: user._id!.toString(),
      email: user.email!,
      role: user.role
    })

    const refreshToken = authService.generateRefreshToken(user._id!.toString())

    console.log('JWT tokens generated, redirecting to sender dashboard...')

    // Redirect to sender dashboard with tokens
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/sender`)
    
    // Clear OAuth state cookie
    response.cookies.set('oauth_state', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 60 * 60 // 1 hour
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    // Set user info cookie for client-side access
    response.cookies.set('user', JSON.stringify({
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })

    return response

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth?error=oauth_failed`)
  }
}