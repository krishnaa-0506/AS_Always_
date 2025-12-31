import { NextRequest, NextResponse } from 'next/server'
import { ApiSecurityService } from '../security/apiSecurity'
import { ErrorLogger, ErrorType } from '../logging/logger'

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Enhanced Security Middleware for API Routes
 * Applies rate limiting, request validation, and security headers
 */
export class SecurityMiddleware {
  private static apiSecurity = ApiSecurityService.getInstance();
  
  /**
   * Apply security middleware to API routes
   */
  static async apply(
    req: NextRequest,
    handler: () => Promise<NextResponse>,
    options?: {
      rateLimitType?: 'auth' | 'api' | 'payment' | 'upload' | 'admin';
      skipRateLimit?: boolean;
      customRateLimit?: { windowMs: number; maxRequests: number };
      requireAuth?: boolean;
    }
  ): Promise<NextResponse> {
    const startTime = Date.now();
    
    try {
      // 1. Validate request format
      const validation = this.apiSecurity.validateRequest(req);
      if (!validation.valid) {
        return this.createErrorResponse(
          'Invalid request format',
          400,
          { errors: validation.errors }
        );
      }
      
      // 2. Apply rate limiting
      if (!options?.skipRateLimit) {
        const rateLimitType = options?.rateLimitType || 'api';
        const rateLimit = await this.apiSecurity.applyRateLimit(
          req,
          rateLimitType,
          options?.customRateLimit
        );
        
        if (!rateLimit.allowed) {
          return this.createRateLimitResponse(rateLimit);
        }
      }
      
      // 3. Execute the actual handler
      const response = await handler();
      
      // 4. Apply security headers
      const securityHeaders = this.apiSecurity.getSecurityHeaders();
      for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
      }
      
      // 5. Log successful request
      this.logRequest(req, response.status, Date.now() - startTime);
      
      return response;
      
    } catch (error) {
      // Log error and return safe error response
      ErrorLogger.log(
        error instanceof Error ? error : new Error('Middleware error'),
        ErrorType.DATABASE,
        {
          endpoint: req.url,
          method: req.method,
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      );
      
      return this.createErrorResponse(
        'Internal server error',
        500,
        { error: 'An unexpected error occurred' }
      );
    }
  }
  
  /**
   * Input sanitization middleware
   */
  static sanitizeInput(data: any): any {
    return ApiSecurityService.getInstance().sanitizeRequestData(data);
  }
  
  /**
   * Create error response with security headers
   */
  private static createErrorResponse(
    message: string,
    status: number,
    details?: any
  ): NextResponse {
    const response = NextResponse.json(
      {
        error: message,
        status,
        ...details,
        timestamp: new Date().toISOString()
      },
      { status }
    );
    
    // Apply security headers even to error responses
    const securityHeaders = this.apiSecurity.getSecurityHeaders();
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }
    
    return response;
  }
  
  /**
   * Create rate limit exceeded response
   */
  private static createRateLimitResponse(rateLimit: {
    limit: number;
    remaining: number;
    resetTime: number;
  }): NextResponse {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        status: 429,
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        resetTime: rateLimit.resetTime,
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        timestamp: new Date().toISOString()
      },
      { status: 429 }
    );
    
    // Apply security headers
    const securityHeaders = this.apiSecurity.getSecurityHeaders();
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }
    
    return response;
  }
  
  /**
   * Log API request
   */
  private static logRequest(req: NextRequest, status: number, processingTime: number): void {
    ErrorLogger.log(
      new Error('API request processed'),
      ErrorType.INFO,
      {
        method: req.method,
        endpoint: req.url,
        status,
        processingTime,
        userAgent: req.headers.get('user-agent'),
        ip: this.getClientIP(req),
        timestamp: new Date().toISOString()
      }
    );
  }
  
  /**
   * Get client IP address
   */
  private static getClientIP(req: NextRequest): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const cfConnectingIP = req.headers.get('cf-connecting-ip');
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    
    return realIP || cfConnectingIP || 'unknown';
  }
}

// Legacy rate limiting function for backward compatibility
export function createRateLimit(windowMs: number, max: number) {
  return (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const key = `${ip}-${req.nextUrl.pathname}`
    
    const record = rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (record.count >= max) {
      return false
    }
    
    record.count++
    rateLimitStore.set(key, record)
    return true
  }
}

export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100) // 100 requests per 15 minutes
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5) // 5 auth attempts per 15 minutes
export const uploadRateLimit = createRateLimit(60 * 60 * 1000, 20) // 20 uploads per hour

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return { valid: errors.length === 0, errors }
}

export function withRateLimit(handler: Function, limiter: (req: NextRequest) => boolean) {
  return async (request: NextRequest, ...args: any[]) => {
    if (!limiter(request)) {
      return NextResponse.json({
        error: 'Too many requests. Please try again later.'
      }, { status: 429 })
    }
    
    return handler(request, ...args)
  }
}

export function withSecurity(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    // Add security headers
    const response = await handler(request, ...args)
    
    if (response instanceof NextResponse) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    }
    
    return response
  }
}