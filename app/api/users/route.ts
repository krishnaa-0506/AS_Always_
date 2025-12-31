import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { SecuritySanitizer } from '@/lib/security/sanitizer'
import { authService } from '@/lib/auth/jwt'
import { DatabaseAccessLogger } from '@/lib/db/accessLogger'
import { validateObjectId } from '@/lib/validations'

// Authentication middleware
async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('accessToken')?.value
  
  if (!token) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }
  
  const payload = await authService.verifyTokenJose(token)
  if (!payload) {
    return { error: NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 }) }
  }
  
  return { user: payload }
}

export async function GET(request: NextRequest) {
  const accessLogger = DatabaseAccessLogger.getInstance();
  const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  try {
    // Authentication required
    const auth = await verifyAuth(request)
    if (auth.error) {
      await accessLogger.logAuthenticationAccess(
        'LOGIN_ATTEMPT',
        'unknown',
        undefined,
        clientIp,
        userAgent,
        false
      );
      return auth.error;
    }
    
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    const id = url.searchParams.get('id')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    if (id) {
      try {
        // Validate ObjectId format
        validateObjectId(id);
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Invalid user ID format'
        }, { status: 400 });
      }
      
      // Users can only access their own data unless they're admin
      if (auth.user.userId !== id && auth.user.role !== 'admin' && auth.user.role !== 'ADMIN') {
        await accessLogger.logReadAccess(
          'users',
          { _id: id },
          auth.user.userId,
          userAgent,
          clientIp
        );
        
        return NextResponse.json({
          success: false,
          error: 'Access denied'
        }, { status: 403 })
      }
      
      const user = await dbService.findUserById(id)
      
      // Log user data access
      accessLogger.logReadAccess(
        'users',
        { _id: id },
        auth.user.userId,
        userAgent,
        clientIp
      );
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: SecuritySanitizer.sanitizeString(user.email || ''),
          name: SecuritySanitizer.sanitizeString(user.name || ''),
          role: user.role,
          createdAt: user.createdAt
        }
      })
    }

    if (email) {
      const user = await dbService.findUserByEmail(email)
      return NextResponse.json({
        success: true,
        user: user ? {
          id: user._id,
          email: SecuritySanitizer.sanitizeString(user.email || ''),
          name: SecuritySanitizer.sanitizeString(user.name || ''),
          role: user.role,
          createdAt: user.createdAt
        } : null
      })
    }

    // Get all users with pagination
    const db = await dbService.connect()
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()

    const totalUsers = await db.collection('users').countDocuments()

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        email: SecuritySanitizer.sanitizeString(user.email || ''),
        name: SecuritySanitizer.sanitizeString(user.name || ''),
        role: user.role,
        createdAt: user.createdAt
      })),
      total: totalUsers,
      hasMore: offset + limit < totalUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}