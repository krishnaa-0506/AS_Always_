import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimiter(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
  
  // Check and update rate limit
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  } else {
    if (rateLimitStore[ip].resetTime < now) {
      rateLimitStore[ip] = {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW
      };
    } else {
      rateLimitStore[ip].count++;
      if (rateLimitStore[ip].count > MAX_REQUESTS) {
        return NextResponse.json({
          success: false,
          error: 'Too Many Requests',
          message: 'Please try again later'
        }, { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitStore[ip].resetTime - now) / 1000).toString()
          }
        });
      }
    }
  }
  
  return null; // Continue with the request
}
