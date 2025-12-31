import { NextRequest, NextResponse } from 'next/server';
import { ErrorLogger, ErrorType } from '../logging/logger';

/**
 * CORS Configuration
 */
interface CORSOptions {
  origin?: string | string[] | ((origin: string) => boolean);
  credentials?: boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  maxAge?: number;
  preflightContinue?: boolean;
}

/**
 * Request Sanitization Service
 * Handles CORS, request validation, and input sanitization
 */
export class RequestSanitizationService {
  private static instance: RequestSanitizationService;
  
  private constructor() {}
  
  static getInstance(): RequestSanitizationService {
    if (!RequestSanitizationService.instance) {
      RequestSanitizationService.instance = new RequestSanitizationService();
    }
    return RequestSanitizationService.instance;
  }
  
  /**
   * Apply CORS headers to response
   */
  applyCORS(
    req: NextRequest,
    response: NextResponse,
    options: CORSOptions = {}
  ): NextResponse {
    const origin = req.headers.get('origin');
    const defaultOptions: CORSOptions = {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://yourdomain.com',
        'https://www.yourdomain.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'X-File-Name'
      ],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Total-Count'
      ],
      maxAge: 86400 // 24 hours
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    // Handle origin validation
    const isOriginAllowed = this.isOriginAllowed(origin, finalOptions.origin);
    
    if (isOriginAllowed && origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else if (!finalOptions.origin) {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    // Set CORS headers
    if (finalOptions.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    if (finalOptions.methods) {
      response.headers.set(
        'Access-Control-Allow-Methods',
        finalOptions.methods.join(', ')
      );
    }
    
    if (finalOptions.allowedHeaders) {
      response.headers.set(
        'Access-Control-Allow-Headers',
        finalOptions.allowedHeaders.join(', ')
      );
    }
    
    if (finalOptions.exposedHeaders) {
      response.headers.set(
        'Access-Control-Expose-Headers',
        finalOptions.exposedHeaders.join(', ')
      );
    }
    
    if (finalOptions.maxAge) {
      response.headers.set('Access-Control-Max-Age', finalOptions.maxAge.toString());
    }
    
    return response;
  }
  
  /**
   * Handle preflight OPTIONS request
   */
  handlePreflight(req: NextRequest, options?: CORSOptions): NextResponse {
    const response = new NextResponse(null, { status: 204 });
    return this.applyCORS(req, response, options);
  }
  
  /**
   * Validate and sanitize JSON request body
   */
  async sanitizeJSONBody(req: NextRequest): Promise<any> {
    try {
      const contentType = req.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type');
      }
      
      const text = await req.text();
      
      // Basic JSON validation
      if (!text.trim()) {
        return {};
      }
      
      // Check for extremely large payloads
      if (text.length > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Request payload too large');
      }
      
      const data = JSON.parse(text);
      return this.deepSanitizeObject(data);
      
    } catch (error) {
      ErrorLogger.log(
        error instanceof Error ? error : new Error('JSON sanitization failed'),
        ErrorType.DATABASE,
        {
          url: req.url,
          method: req.method,
          contentType: req.headers.get('content-type'),
          timestamp: new Date().toISOString()
        }
      );
      
      throw new Error('Invalid JSON payload');
    }
  }
  
  /**
   * Sanitize form data
   */
  async sanitizeFormData(req: NextRequest): Promise<{ [key: string]: any }> {
    try {
      const formData = await req.formData();
      const sanitized: { [key: string]: any } = {};
      
      const entries = Array.from(formData.entries());
      for (const [key, value] of entries) {
        if (this.isDangerousKey(key)) {
          continue;
        }
        
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (value instanceof File) {
          // Validate file
          const validatedFile = this.validateFile(value);
          if (validatedFile) {
            sanitized[key] = validatedFile;
          }
        }
      }
      
      return sanitized;
      
    } catch (error) {
      ErrorLogger.log(
        error instanceof Error ? error : new Error('Form data sanitization failed'),
        ErrorType.DATABASE,
        {
          url: req.url,
          method: req.method,
          contentType: req.headers.get('content-type'),
          timestamp: new Date().toISOString()
        }
      );
      
      throw new Error('Invalid form data');
    }
  }
  
  /**
   * Sanitize URL query parameters
   */
  sanitizeQueryParams(req: NextRequest): { [key: string]: string } {
    const url = new URL(req.url);
    const params: { [key: string]: string } = {};
    
    const entries = Array.from(url.searchParams.entries());
    for (const [key, value] of entries) {
      if (this.isDangerousKey(key)) {
        continue;
      }
      
      params[key] = this.sanitizeString(value);
    }
    
    return params;
  }
  
  /**
   * Validate file upload
   */
  private validateFile(file: File): File | null {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return null;
    }
    
    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return null;
    }
    
    // Check filename for dangerous patterns
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    if (safeName !== file.name) {
      // Create new file with safe name
      return new File([file], safeName, { type: file.type });
    }
    
    return file;
  }
  
  /**
   * Deep sanitize object recursively
   */
  private deepSanitizeObject(obj: any, depth: number = 0): any {
    // Prevent infinite recursion
    if (depth > 20) {
      return {};
    }
    
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitizeObject(item, depth + 1)).slice(0, 1000); // Limit array size
    }
    
    if (typeof obj === 'object') {
      const sanitized: { [key: string]: any } = {};
      
      // Limit object properties
      const keys = Object.keys(obj).slice(0, 100);
      
      for (const key of keys) {
        if (this.isDangerousKey(key)) {
          continue;
        }
        
        const value = obj[key];
        
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (typeof value === 'object') {
          sanitized[key] = this.deepSanitizeObject(value, depth + 1);
        }
      }
      
      return sanitized;
    }
    
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    return obj;
  }
  
  /**
   * Sanitize string input
   */
  private sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Limit string length
    if (input.length > 10000) {
      input = input.substring(0, 10000);
    }
    
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/data:.*?base64/gi, '') // Remove data URLs
      .trim();
  }
  
  /**
   * Check if key is potentially dangerous
   */
  private isDangerousKey(key: string): boolean {
    const dangerousKeys = [
      '__proto__',
      'constructor',
      'prototype',
      'exec',
      'eval',
      'function',
      'require',
      'process',
      'global',
      'window',
      'document'
    ];
    
    return dangerousKeys.includes(key.toLowerCase()) || key.startsWith('__');
  }
  
  /**
   * Check if origin is allowed
   */
  private isOriginAllowed(
    origin: string | null,
    allowedOrigins?: string | string[] | ((origin: string) => boolean)
  ): boolean {
    if (!origin || !allowedOrigins) {
      return false;
    }
    
    if (typeof allowedOrigins === 'function') {
      return allowedOrigins(origin);
    }
    
    if (typeof allowedOrigins === 'string') {
      return allowedOrigins === origin;
    }
    
    if (Array.isArray(allowedOrigins)) {
      return allowedOrigins.includes(origin);
    }
    
    return false;
  }
}