import { ErrorLogger, ErrorType } from '../logging/logger';

/**
 * Database Access Logger
 * Provides comprehensive logging for all database access operations
 * for security monitoring and audit compliance
 */
export class DatabaseAccessLogger {
  private static instance: DatabaseAccessLogger;
  
  private constructor() {}
  
  static getInstance(): DatabaseAccessLogger {
    if (!DatabaseAccessLogger.instance) {
      DatabaseAccessLogger.instance = new DatabaseAccessLogger();
    }
    return DatabaseAccessLogger.instance;
  }

  /**
   * Log database read access operations
   */
  logReadAccess(
    collection: string,
    query: any,
    userId?: string,
    userAgent?: string,
    ipAddress?: string
  ): void {
    ErrorLogger.log(
      new Error('Database read access'),
      ErrorType.INFO,
      {
        operation: 'READ',
        collection,
        query: this.sanitizeLogData(query),
        userId,
        userAgent,
        ipAddress,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log database write access operations
   */
  logWriteAccess(
    collection: string,
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    data: any,
    userId?: string,
    userAgent?: string,
    ipAddress?: string
  ): void {
    ErrorLogger.log(
      new Error('Database write access'),
      ErrorType.INFO,
      {
        operation,
        collection,
        data: this.sanitizeLogData(data),
        userId,
        userAgent,
        ipAddress,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log authentication-related database access
   */
  logAuthenticationAccess(
    operation: string,
    email?: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
    success: boolean = true
  ): void {
    ErrorLogger.log(
      new Error('Authentication database access'),
      ErrorType.INFO,
      {
        operation: 'AUTH_' + operation,
        email: email ? this.sanitizeEmail(email) : undefined,
        userId,
        ipAddress,
        userAgent,
        success,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log payment-related database access
   */
  logPaymentAccess(
    operation: string,
    userId?: string,
    amount?: number,
    paymentId?: string,
    ipAddress?: string
  ): void {
    ErrorLogger.log(
      new Error('Payment database access'),
      ErrorType.INFO,
      {
        operation: 'PAYMENT_' + operation,
        userId,
        amount,
        paymentId,
        ipAddress,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log admin-level database access
   */
  logAdminAccess(
    operation: string,
    adminUserId: string,
    targetUserId?: string,
    collection?: string,
    ipAddress?: string
  ): void {
    ErrorLogger.log(
      new Error('Admin database access'),
      ErrorType.INFO,
      {
        operation: 'ADMIN_' + operation,
        adminUserId,
        targetUserId,
        collection,
        ipAddress,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Sanitize sensitive data for logging
   */
  private sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'apiKey',
      'creditCard', 'ssn', 'socialSecurity', 'bankAccount'
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize email for logging (show partial)
   */
  private sanitizeEmail(email: string): string {
    if (!email || !email.includes('@')) {
      return '[INVALID_EMAIL]';
    }
    
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 
      ? local.substring(0, 2) + '***'
      : '***';
    
    return `${maskedLocal}@${domain}`;
  }
}