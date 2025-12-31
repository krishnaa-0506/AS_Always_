import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Headers Configuration
 */
interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    directives?: {
      defaultSrc?: string[];
      scriptSrc?: string[];
      styleSrc?: string[];
      imgSrc?: string[];
      connectSrc?: string[];
      fontSrc?: string[];
      objectSrc?: string[];
      mediaSrc?: string[];
      frameSrc?: string[];
      baseUri?: string[];
      formAction?: string[];
      frameAncestors?: string[];
      upgradeInsecureRequests?: boolean;
    };
    reportUri?: string;
    reportOnly?: boolean;
  };
  strictTransportSecurity?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  permissionsPolicy?: {
    features?: Record<string, string[]>;
  };
  referrerPolicy?: string;
  crossOriginEmbedderPolicy?: string;
  crossOriginOpenerPolicy?: string;
  crossOriginResourcePolicy?: string;
}

/**
 * Security Headers Service
 * Provides comprehensive security headers for web application protection
 */
export class SecurityHeadersService {
  private static instance: SecurityHeadersService;
  
  private constructor() {}
  
  static getInstance(): SecurityHeadersService {
    if (!SecurityHeadersService.instance) {
      SecurityHeadersService.instance = new SecurityHeadersService();
    }
    return SecurityHeadersService.instance;
  }
  
  /**
   * Apply comprehensive security headers to response
   */
  applyHeaders(
    req: NextRequest,
    response: NextResponse,
    config?: SecurityHeadersConfig
  ): NextResponse {
    const defaultConfig = this.getDefaultConfig();
    const finalConfig = { ...defaultConfig, ...config };
    
    // Content Security Policy
    if (finalConfig.contentSecurityPolicy) {
      const cspHeader = this.buildCSPHeader(finalConfig.contentSecurityPolicy);
      const headerName = finalConfig.contentSecurityPolicy.reportOnly 
        ? 'Content-Security-Policy-Report-Only' 
        : 'Content-Security-Policy';
      response.headers.set(headerName, cspHeader);
    }
    
    // Strict Transport Security
    if (finalConfig.strictTransportSecurity) {
      const stsHeader = this.buildSTSHeader(finalConfig.strictTransportSecurity);
      response.headers.set('Strict-Transport-Security', stsHeader);
    }
    
    // X-Content-Type-Options
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options
    response.headers.set('X-Frame-Options', 'DENY');
    
    // X-XSS-Protection
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Referrer Policy
    if (finalConfig.referrerPolicy) {
      response.headers.set('Referrer-Policy', finalConfig.referrerPolicy);
    }
    
    // Permissions Policy
    if (finalConfig.permissionsPolicy) {
      const permissionsHeader = this.buildPermissionsHeader(finalConfig.permissionsPolicy);
      response.headers.set('Permissions-Policy', permissionsHeader);
    }
    
    // Cross-Origin Policies
    if (finalConfig.crossOriginEmbedderPolicy) {
      response.headers.set('Cross-Origin-Embedder-Policy', finalConfig.crossOriginEmbedderPolicy);
    }
    
    if (finalConfig.crossOriginOpenerPolicy) {
      response.headers.set('Cross-Origin-Opener-Policy', finalConfig.crossOriginOpenerPolicy);
    }
    
    if (finalConfig.crossOriginResourcePolicy) {
      response.headers.set('Cross-Origin-Resource-Policy', finalConfig.crossOriginResourcePolicy);
    }
    
    // Additional API-specific headers
    response.headers.set('X-Powered-By', 'Custom API'); // Hide actual framework
    response.headers.set('Server', 'API'); // Generic server identification
    response.headers.set('X-API-Version', '1.0');
    
    // Cache control for sensitive endpoints
    if (this.isSensitiveEndpoint(req.url)) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  }
  
  /**
   * Get headers specifically for API responses
   */
  getAPIHeaders(): Record<string, string> {
    return {
      // Basic security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // API specific headers
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'X-API-Version': '1.0',
      'Server': 'API',
      
      // Content Security Policy for API
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
      
      // Permissions Policy (restrictive for API)
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()',
      
      // Cross-Origin policies
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
    };
  }
  
  /**
   * Get headers for file uploads
   */
  getUploadHeaders(): Record<string, string> {
    return {
      ...this.getAPIHeaders(),
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; script-src 'none'; object-src 'none';",
      'Cross-Origin-Resource-Policy': 'cross-origin', // Allow uploads from different origins
    };
  }
  
  /**
   * Get headers for authentication endpoints
   */
  getAuthHeaders(): Record<string, string> {
    return {
      ...this.getAPIHeaders(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, private, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '-1',
      'Clear-Site-Data': '"cache", "storage"', // Clear sensitive data on auth endpoints
    };
  }
  
  /**
   * Build Content Security Policy header
   */
  private buildCSPHeader(cspConfig: NonNullable<SecurityHeadersConfig['contentSecurityPolicy']>): string {
    const directives: string[] = [];
    
    if (cspConfig.directives) {
      for (const [directive, values] of Object.entries(cspConfig.directives)) {
        if (directive === 'upgradeInsecureRequests' && values) {
          directives.push('upgrade-insecure-requests');
        } else if (Array.isArray(values) && values.length > 0) {
          const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
          directives.push(`${directiveName} ${values.join(' ')}`);
        }
      }
    }
    
    if (cspConfig.reportUri) {
      directives.push(`report-uri ${cspConfig.reportUri}`);
    }
    
    return directives.join('; ');
  }
  
  /**
   * Build Strict Transport Security header
   */
  private buildSTSHeader(stsConfig: NonNullable<SecurityHeadersConfig['strictTransportSecurity']>): string {
    const parts: string[] = [`max-age=${stsConfig.maxAge || 31536000}`];
    
    if (stsConfig.includeSubDomains) {
      parts.push('includeSubDomains');
    }
    
    if (stsConfig.preload) {
      parts.push('preload');
    }
    
    return parts.join('; ');
  }
  
  /**
   * Build Permissions Policy header
   */
  private buildPermissionsHeader(permissionsConfig: NonNullable<SecurityHeadersConfig['permissionsPolicy']>): string {
    const policies: string[] = [];
    
    if (permissionsConfig.features) {
      for (const [feature, allowlist] of Object.entries(permissionsConfig.features)) {
        if (allowlist.length === 0) {
          policies.push(`${feature}=()`);
        } else {
          const origins = allowlist.map(origin => origin === '*' ? '*' : `"${origin}"`).join(' ');
          policies.push(`${feature}=(${origins})`);
        }
      }
    }
    
    return policies.join(', ');
  }
  
  /**
   * Get default security configuration
   */
  private getDefaultConfig(): SecurityHeadersConfig {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https:'],
          fontSrc: ["'self'", 'https:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: true,
        },
        reportOnly: false,
      },
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      permissionsPolicy: {
        features: {
          camera: [],
          microphone: [],
          geolocation: [],
          payment: [],
          usb: [],
          magnetometer: [],
          gyroscope: [],
          speaker: [],
          fullscreen: ["'self'"],
          autoplay: [],
        },
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
    };
  }
  
  /**
   * Check if endpoint contains sensitive data
   */
  private isSensitiveEndpoint(url: string): boolean {
    const sensitivePatterns = [
      '/api/auth',
      '/api/payment',
      '/api/admin',
      '/api/users',
      '/api/upload',
      '/api/messages',
    ];
    
    return sensitivePatterns.some(pattern => url.includes(pattern));
  }
}