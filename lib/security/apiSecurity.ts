import { NextRequest, NextResponse } from 'next/server';
import { ErrorLogger, ErrorType } from '../logging/logger';

/**
 * Rate Limiting Configuration
 */
interface RateLimit {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

/**
 * Rate Limiting Store
 */
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();
  
  /**
   * Increment request count for a key
   */
  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number; isExceeded: boolean }> {
    const now = Date.now();
    const existing = this.store.get(key);
    
    // If no existing record or window expired, create new one
    if (!existing || now > existing.resetTime) {
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return { count: 1, resetTime, isExceeded: false };
    }
    
    // Increment existing count
    existing.count++;
    this.store.set(key, existing);
    
    return {
      count: existing.count,
      resetTime: existing.resetTime,
      isExceeded: false // Will be determined by the caller
    };
  }
  
  /**
   * Get current count for a key
   */
  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const existing = this.store.get(key);
    if (!existing || Date.now() > existing.resetTime) {
      return null;
    }
    return existing;
  }
  
  /**
   * Clean expired entries (run periodically)
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.store.forEach((value, key) => {
      if (now > value.resetTime) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.store.delete(key));
  }
}

/**
 * API Security Service
 * Handles rate limiting, request validation, and security headers
 */
export class ApiSecurityService {
  private static instance: ApiSecurityService;
  private rateLimitStore: RateLimitStore;
  private cleanupInterval: NodeJS.Timeout;
  
  // Default rate limits for different endpoint types
  private static readonly DEFAULT_LIMITS: Record<string, RateLimit> = {
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 requests per 15 minutes for auth
    api: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes for general API
    payment: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 payments per hour
    upload: { windowMs: 15 * 60 * 1000, maxRequests: 20 }, // 20 uploads per 15 minutes
    admin: { windowMs: 15 * 60 * 1000, maxRequests: 50 } // 50 admin requests per 15 minutes
  };
  
  private constructor() {
    this.rateLimitStore = new RateLimitStore();
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.rateLimitStore.cleanup();
    }, 5 * 60 * 1000);
  }
  
  static getInstance(): ApiSecurityService {
    if (!ApiSecurityService.instance) {
      ApiSecurityService.instance = new ApiSecurityService();
    }
    return ApiSecurityService.instance;
  }
  
  /**
   * Apply rate limiting to a request
   */
  async applyRateLimit(
    req: NextRequest,
    limitType: keyof typeof ApiSecurityService.DEFAULT_LIMITS = 'api',
    customLimit?: Partial<RateLimit>
  ): Promise<{ allowed: boolean; limit: number; remaining: number; resetTime: number }> {
    const limit = { ...ApiSecurityService.DEFAULT_LIMITS[limitType], ...customLimit };
    
    // Generate key for rate limiting
    const key = this.generateRateLimitKey(req, limitType, limit.keyGenerator);
    
    try {
      // Get current count and increment
      const result = await this.rateLimitStore.increment(key, limit.windowMs);
      
      const allowed = result.count <= limit.maxRequests;
      const remaining = Math.max(0, limit.maxRequests - result.count);
      
      // Log rate limit events
      if (!allowed) {
        this.logRateLimitExceeded(req, limitType, result.count, limit.maxRequests);
      }
      
      return {
        allowed,
        limit: limit.maxRequests,
        remaining,
        resetTime: result.resetTime
      };
    } catch (error) {
      // If rate limiting fails, allow request but log the error
      ErrorLogger.log(
        error instanceof Error ? error : new Error('Rate limiting failed'),
        ErrorType.DATABASE,
        {
          endpoint: req.url,
          method: req.method,
          ip: this.getClientIP(req),
          limitType
        }
      );
      
      return {
        allowed: true,
        limit: limit.maxRequests,
        remaining: limit.maxRequests,
        resetTime: Date.now() + limit.windowMs
      };
    }
  }
  
  /**
   * Generate security headers for API responses
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // XSS Protection
      'X-XSS-Protection': '1; mode=block',
      
      // Referrer Policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Content Security Policy
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https:;",
      
      // Permissions Policy
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      
      // HTTP Strict Transport Security (for HTTPS)
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      
      // Cache Control for API responses
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      
      // API Version
      'X-API-Version': '1.0',
      
      // Server identification hiding
      'Server': 'API'
    };
  }
  
  /**
   * Validate request format and content
   */
  validateRequest(req: NextRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check content type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers.get('content-type');
      if (!contentType || (!contentType.includes('application/json') && !contentType.includes('multipart/form-data'))) {
        errors.push('Invalid Content-Type header');
      }
    }
    
    // Check for required headers
    const userAgent = req.headers.get('user-agent');
    if (!userAgent || userAgent.length < 10) {
      errors.push('Invalid or missing User-Agent header');
    }
    
    // Check URL length
    if (req.url.length > 2048) {
      errors.push('Request URL too long');
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.\./,  // Directory traversal
      /<script/i,  // XSS attempt
      /union.*select/i,  // SQL injection attempt
      /javascript:/i,  // JavaScript injection
      /vbscript:/i,  // VBScript injection
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(req.url)) {
        errors.push('Suspicious request pattern detected');
        break;
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Sanitize request parameters
   */
  sanitizeRequestData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      // Skip potentially dangerous keys
      if (this.isDangerousKey(key)) {
        continue;
      }
      
      if (typeof value === 'string') {
        // Basic XSS prevention
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeRequestData(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Generate rate limiting key
   */
  private generateRateLimitKey(
    req: NextRequest,
    limitType: string,
    customGenerator?: (req: NextRequest) => string
  ): string {
    if (customGenerator) {
      return customGenerator(req);
    }
    
    const ip = this.getClientIP(req);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const path = new URL(req.url).pathname;
    
    return `${limitType}:${ip}:${this.hashString(userAgent)}:${path}`;
  }
  
  /**
   * Get client IP address
   */
  private getClientIP(req: NextRequest): string {
    // Check various headers for IP address
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const cfConnectingIP = req.headers.get('cf-connecting-ip');
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    return 'unknown';
  }
  
  /**
   * Log rate limit exceeded events
   */
  private logRateLimitExceeded(
    req: NextRequest,
    limitType: string,
    currentCount: number,
    maxRequests: number
  ): void {
    ErrorLogger.log(
      new Error('Rate limit exceeded'),
      ErrorType.DATABASE,
      {
        endpoint: req.url,
        method: req.method,
        ip: this.getClientIP(req),
        userAgent: req.headers.get('user-agent'),
        limitType,
        currentCount,
        maxRequests,
        timestamp: new Date().toISOString()
      }
    );
  }
  
  /**
   * Check if a key is potentially dangerous
   */
  private isDangerousKey(key: string): boolean {
    const dangerousKeys = [
      '__proto__', 'constructor', 'prototype',
      'exec', 'eval', 'function', 'require',
      'process', 'global', 'window'
    ];
    
    return dangerousKeys.includes(key.toLowerCase());
  }
  
  /**
   * Sanitize string input
   */
  private sanitizeString(input: string): string {
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  /**
   * Simple string hashing for rate limit keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}