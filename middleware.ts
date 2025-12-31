import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// JWT Secret for verification - NO FALLBACK FOR SECURITY
const JWT_SECRET_ENV = process.env.JWT_SECRET
if (!JWT_SECRET_ENV) {
  throw new Error('JWT_SECRET environment variable is required')
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_ENV)

// Verify JWT token using jose library (edge-runtime compatible)
async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: string; exp: number }
  } catch (error) {
    return null
  }
}

// Simple rate limiting function
function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientIp = request.ip || 'anonymous'
    if (!checkRateLimit(clientIp, 100, 60000)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
    }
  }

  const response = NextResponse.next()

  // Enhanced Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Enhanced CSP header - allow Cloudinary and ImageKit
  if (process.env.CSP_ENABLED !== 'false') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob: https://res.cloudinary.com https://ik.imagekit.io; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.mongodb.net https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://api.cloudinary.com https://ik.imagekit.io; media-src 'self' blob: https://res.cloudinary.com https://ik.imagekit.io; frame-ancestors 'none';"
    )
  }

  // CORS headers
  const origin = request.headers.get('origin')
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim())
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers })
  }

  // Authentication check for protected routes
  const protectedSenderRoutes = ['/sender']
  const protectedAdminRoutes = ['/admin'] // Protect all admin routes
  const publicAdminRoutes = ['/admin/login'] // Except login page
  
  const isProtectedSender = protectedSenderRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isProtectedAdmin = protectedAdminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  ) && !publicAdminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedSender || isProtectedAdmin) {
    // Special handling for admin routes - check admin session
    if (isProtectedAdmin) {
      const adminSession = request.cookies.get('asalways-admin')?.value
      if (adminSession !== 'authenticated') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      // Admin is authenticated, continue
      return response
    }

    // Regular JWT token handling for sender routes
    let token: string | null = null
    
    // 1. Authorization header
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    }
    
    // 2. Cookie
    if (!token) {
      token = request.cookies.get('auth-token')?.value || 
              request.cookies.get('accessToken')?.value || null
    }
    
    // 3. URL parameter (for development only)
    if (!token && process.env.NODE_ENV === 'development') {
      token = request.nextUrl.searchParams.get('token')
    }

    // Verify token
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      // Clear invalid tokens
      const redirectResponse = NextResponse.redirect(new URL('/auth', request.url))
      redirectResponse.cookies.delete('auth-token')
      redirectResponse.cookies.delete('accessToken')
      redirectResponse.cookies.delete('refreshToken')
      return redirectResponse
    }

    // Check token expiry
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      const redirectResponse = NextResponse.redirect(new URL('/auth', request.url))
      redirectResponse.cookies.delete('auth-token')
      redirectResponse.cookies.delete('accessToken')
      redirectResponse.cookies.delete('refreshToken')
      return redirectResponse
    }

    // Admin routes require admin role
    if (isProtectedAdmin && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Add user info to headers for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set('X-User-Id', payload.userId)
      response.headers.set('X-User-Email', payload.email)
      response.headers.set('X-User-Role', payload.role)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}