import { NextRequest, NextResponse } from 'next/server';
import { SecurityMiddleware } from '../../../../lib/middleware/security';
import { DatabaseAccessLogger } from '../../../../lib/db/accessLogger';
import { createUserSchema } from '../../../../lib/validations/index';
import { authService } from '../../../../lib/auth/jwt';

// Authentication middleware
async function verifyAuth(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('accessToken')?.value
  
  if (!token) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  try {
    const decoded = await authService.verifyToken(token)
    if (!decoded) {
      return { error: NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 }) }
    }
    return { user: decoded }
  } catch (error) {
    return { error: NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 }) }
  }
}

/**
 * Enhanced Users API with comprehensive security
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  return SecurityMiddleware.apply(
    req,
    async () => {
      try {
        // Get user from token for authentication
        const auth = await verifyAuth(req);
        if (auth.error) {
          return NextResponse.json(
            { error: 'Authentication required', status: 401 },
            { status: 401 }
          );
        }
        
        // Log database access
        const accessLogger = DatabaseAccessLogger.getInstance();
        accessLogger.logReadAccess(
          'users',
          { userId: auth.user.userId },
          auth.user.userId,
          req.headers.get('user-agent') || 'unknown',
          SecurityMiddleware['getClientIP'](req)
        );
        
        // Return user data (sanitized)
        const userData = {
          id: auth.user.userId,
          email: auth.user.email,
          role: auth.user.role
        };
        
        return NextResponse.json({
          success: true,
          data: userData,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to fetch user data',
            status: 500,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }
    },
    {
      rateLimitType: 'api',
      requireAuth: true
    }
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return SecurityMiddleware.apply(
    req,
    async () => {
      try {
        // Parse and sanitize request body
        const body = await req.json();
        const sanitizedData = SecurityMiddleware.sanitizeInput(body);
        
        // Validate user data
        const validation = createUserSchema.safeParse(sanitizedData);
        if (!validation.success) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              status: 400,
              details: validation.error.issues,
              timestamp: new Date().toISOString()
            },
            { status: 400 }
          );
        }
        
        // Check admin privileges for user creation
        const auth = await verifyAuth(req);
        if (auth.error || !auth.user || auth.user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin privileges required', status: 403 },
            { status: 403 }
          );
        }
        
        // Log database access
        const accessLogger = DatabaseAccessLogger.getInstance();
        accessLogger.logWriteAccess(
          'users',
          'CREATE',
          sanitizedData,
          auth.user.userId,
          req.headers.get('user-agent') || 'unknown',
          SecurityMiddleware['getClientIP'](req)
        );
        
        // Here you would create the user in the database
        // For now, return success response
        return NextResponse.json(
          {
            success: true,
            message: 'User created successfully',
            timestamp: new Date().toISOString()
          },
          { status: 201 }
        );
        
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to create user',
            status: 500,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }
    },
    {
      rateLimitType: 'admin',
      requireAuth: true
    }
  );
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  return SecurityMiddleware.apply(
    req,
    async () => {
      try {
        // Parse and sanitize request body
        const body = await req.json();
        const sanitizedData = SecurityMiddleware.sanitizeInput(body);
        
        // Get authenticated user
        const auth = await verifyAuth(req);
        if (auth.error) {
          return NextResponse.json(
            { error: 'Authentication required', status: 401 },
            { status: 401 }
          );
        }
        
        // Users can only update their own data (unless admin)
        const targetUserId = sanitizedData.id || auth.user.userId;
        if (targetUserId !== auth.user.userId && auth.user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Access denied', status: 403 },
            { status: 403 }
          );
        }
        
        // Validate update data
        const validation = createUserSchema.partial().safeParse(sanitizedData);
        if (!validation.success) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              status: 400,
              details: validation.error.issues,
              timestamp: new Date().toISOString()
            },
            { status: 400 }
          );
        }
        
        // Log database access
        const accessLogger = DatabaseAccessLogger.getInstance();
        accessLogger.logWriteAccess(
          'users',
          'UPDATE',
          { ...sanitizedData, targetUserId },
          auth.user.userId,
          req.headers.get('user-agent') || 'unknown',
          SecurityMiddleware['getClientIP'](req)
        );
        
        // Here you would update the user in the database
        // For now, return success response
        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to update user',
            status: 500,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }
    },
    {
      rateLimitType: 'api',
      requireAuth: true
    }
  );
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return SecurityMiddleware.apply(
    req,
    async () => {
      try {
        // Only admins can delete users
        const auth = await verifyAuth(req);
        if (auth.error || !auth.user || auth.user.role !== 'admin') {
          return NextResponse.json(
            { error: 'Admin privileges required', status: 403 },
            { status: 403 }
          );
        }
        
        const { searchParams } = new URL(req.url);
        const targetUserId = searchParams.get('id');
        
        if (!targetUserId) {
          return NextResponse.json(
            { error: 'User ID required', status: 400 },
            { status: 400 }
          );
        }
        
        // Prevent self-deletion
        if (targetUserId === auth.user.userId) {
          return NextResponse.json(
            { error: 'Cannot delete own account', status: 400 },
            { status: 400 }
          );
        }
        
        // Log database access
        const accessLogger = DatabaseAccessLogger.getInstance();
        accessLogger.logWriteAccess(
          'users',
          'DELETE',
          { targetUserId },
          auth.user.userId,
          req.headers.get('user-agent') || 'unknown',
          SecurityMiddleware['getClientIP'](req)
        );
        
        // Here you would delete the user from the database
        // For now, return success response
        return NextResponse.json({
          success: true,
          message: 'User deleted successfully',
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to delete user',
            status: 500,
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        );
      }
    },
    {
      rateLimitType: 'admin',
      requireAuth: true
    }
  );
}