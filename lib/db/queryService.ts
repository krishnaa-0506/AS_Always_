import { ErrorLogger, ErrorType } from '../logging/logger';
import { SecuritySanitizer } from '../security/sanitizer';
import { validateObjectId } from '../validations';

/**
 * Database Query Security Service
 * Provides secure database query operations with injection prevention
 * and comprehensive input validation
 */
export class QuerySecurityService {
  
  /**
   * Sanitize and validate MongoDB query parameters
   */
  static sanitizeQuery(query: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(query)) {
      // Prevent NoSQL injection by blocking MongoDB operators
      if (key.startsWith('$')) {
        ErrorLogger.log(
          new Error(`Potential NoSQL injection attempt: ${key}`),
          ErrorType.VALIDATION,
          { query, suspiciousKey: key }
        );
        continue; // Skip potentially malicious keys
      }
      
      // Sanitize string values
      if (typeof value === 'string') {
        sanitized[key] = SecuritySanitizer.sanitizeString(value);
      } 
      // Handle ObjectId validation
      else if (key.includes('Id') || key === '_id') {
        if (typeof value === 'string') {
          try {
            validateObjectId(value);
            sanitized[key] = value;
          } catch (error) {
            ErrorLogger.log(
              new Error(`Invalid ObjectId in query: ${key}=${value}`),
              ErrorType.VALIDATION,
              { query, invalidKey: key, invalidValue: value }
            );
            throw new Error(`Invalid ID format for ${key}`);
          }
        }
      }
      // Handle nested objects (recursive sanitization)
      else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeQuery(value);
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? SecuritySanitizer.sanitizeString(item) : item
        );
      }
      // Pass through other primitive types
      else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Validate and sanitize MongoDB update operations
   */
  static sanitizeUpdateOperation(update: Record<string, any>): Record<string, any> {
    const allowedOperators = ['$set', '$unset', '$inc', '$push', '$pull', '$addToSet'];
    const sanitized: Record<string, any> = {};
    
    for (const [operator, fields] of Object.entries(update)) {
      // Only allow specific MongoDB update operators
      if (!allowedOperators.includes(operator)) {
        ErrorLogger.log(
          new Error(`Unauthorized update operator: ${operator}`),
          ErrorType.VALIDATION,
          { update, unauthorizedOperator: operator }
        );
        throw new Error(`Unauthorized update operation: ${operator}`);
      }
      
      // Sanitize the fields within the operator
      if (typeof fields === 'object' && fields !== null) {
        sanitized[operator] = this.sanitizeQuery(fields);
      }
    }
    
    return sanitized;
  }
  
  /**
   * Validate MongoDB aggregation pipeline stages
   */
  static sanitizeAggregationPipeline(pipeline: Record<string, any>[]): Record<string, any>[] {
    const allowedStages = ['$match', '$group', '$sort', '$limit', '$skip', '$project', '$lookup', '$unwind'];
    
    return pipeline.map((stage, index) => {
      const stageKey = Object.keys(stage)[0];
      
      if (!allowedStages.includes(stageKey)) {
        ErrorLogger.log(
          new Error(`Unauthorized aggregation stage: ${stageKey}`),
          ErrorType.VALIDATION,
          { pipeline, stageIndex: index, unauthorizedStage: stageKey }
        );
        throw new Error(`Unauthorized aggregation stage: ${stageKey}`);
      }
      
      // Sanitize stage content
      return {
        [stageKey]: typeof stage[stageKey] === 'object' 
          ? this.sanitizeQuery(stage[stageKey])
          : stage[stageKey]
      };
    });
  }
  
  /**
   * Create safe projection object for MongoDB queries
   */
  static createSafeProjection(fields: string[]): Record<string, number> {
    const projection: Record<string, number> = {};
    
    for (const field of fields) {
      // Validate field names to prevent injection
      if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(field)) {
        ErrorLogger.log(
          new Error(`Invalid field name in projection: ${field}`),
          ErrorType.VALIDATION,
          { fields, invalidField: field }
        );
        continue;
      }
      
      projection[field] = 1;
    }
    
    return projection;
  }
  
  /**
   * Validate and limit query options to prevent resource abuse
   */
  static sanitizeQueryOptions(options: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    // Limit result count to prevent memory issues
    if (options.limit) {
      const limit = parseInt(options.limit);
      if (isNaN(limit) || limit < 1) {
        sanitized.limit = 10; // Default limit
      } else {
        sanitized.limit = Math.min(limit, 1000); // Max limit of 1000
      }
    } else {
      sanitized.limit = 10; // Default limit
    }
    
    // Validate skip parameter
    if (options.skip) {
      const skip = parseInt(options.skip);
      if (isNaN(skip) || skip < 0) {
        sanitized.skip = 0;
      } else {
        sanitized.skip = Math.min(skip, 100000); // Max skip of 100k
      }
    }
    
    // Validate sort parameter
    if (options.sort) {
      if (typeof options.sort === 'object') {
        sanitized.sort = this.sanitizeQuery(options.sort);
      }
    }
    
    return sanitized;
  }
  
  /**
   * Log database query for security auditing
   */
  static logQuery(
    operation: string, 
    collection: string, 
    query: Record<string, any>, 
    userId?: string
  ): void {
    ErrorLogger.log(
      new Error('Database query executed'),
      ErrorType.INFO,
      {
        operation,
        collection,
        query: SecuritySanitizer.sanitizeForLogs(JSON.stringify(query)),
        userId,
        timestamp: new Date().toISOString()
      }
    );
  }
}