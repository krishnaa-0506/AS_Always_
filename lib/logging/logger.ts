import pino from 'pino';

// Create a simple console logger to avoid worker thread issues
const createSimpleLogger = () => ({
  info: (obj: any) => console.log('[INFO]', obj),
  error: (obj: any) => console.error('[ERROR]', obj),
  warn: (obj: any) => console.warn('[WARN]', obj),
  debug: (obj: any) => console.debug('[DEBUG]', obj)
});

// Use simple logger in development to avoid worker thread issues
const logger = process.env.NODE_ENV === 'production'
  ? pino({
      level: process.env.LOG_LEVEL || 'info',
      base: { pid: process.pid }
    })
  : createSimpleLogger();

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  DATABASE = 'DATABASE_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  AUTH = 'AUTHENTICATION_ERROR',
  GENERATION = 'GENERATION_ERROR',
  SYSTEM = 'SYSTEM_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  INFO = 'INFO'
}

interface ErrorLog {
  type: ErrorType;
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export class ErrorLogger {
  static log(error: Error, type: ErrorType, metadata?: Record<string, any>) {
    const errorLog: ErrorLog = {
      type,
      message: error.message,
      stack: error.stack,
      metadata
    };

    logger.error(errorLog);
  }

  static info(message: string, metadata?: Record<string, any>) {
    logger.info({ message, ...metadata });
  }

  static warn(message: string, metadata?: Record<string, any>) {
    logger.warn({ message, ...metadata });
  }
}

export default logger;
