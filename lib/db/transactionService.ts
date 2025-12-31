import { Db, MongoClient, ClientSession } from 'mongodb';
import { ErrorLogger, ErrorType } from '../logging/logger';
import { QuerySecurityService } from './queryService';
import { DatabaseService } from './mongodb';

/**
 * Transaction Security Service
 * Provides secure database transaction management with proper error handling,
 * logging, and rollback mechanisms for data consistency
 */
export class TransactionSecurityService {
  private static instance: TransactionSecurityService;
  private dbService: DatabaseService;
  
  private constructor() {
    this.dbService = new DatabaseService();
  }
  
  static getInstance(): TransactionSecurityService {
    if (!TransactionSecurityService.instance) {
      TransactionSecurityService.instance = new TransactionSecurityService();
    }
    return TransactionSecurityService.instance;
  }
  
  /**
   * Execute a secure database transaction with automatic rollback on failure
   */
  async executeSecureTransaction<T>(
    operations: (session: ClientSession, db: Db) => Promise<T>,
    transactionId?: string
  ): Promise<T> {
    const id = transactionId || this.generateTransactionId();
    let session: ClientSession | null = null;
    
    try {
      const db = await this.dbService.connect();
      const client = this.dbService.client;
      if (!client) {
        throw new Error('Database client not available');
      }
      session = client.startSession();
      
      // Log transaction start
      ErrorLogger.log(
        new Error('Transaction started'),
        ErrorType.INFO,
        {
          transactionId: id,
          timestamp: new Date().toISOString()
        }
      );
      
      if (!session) {
        throw new Error('Failed to create database session');
      }
      
      // Start transaction with proper options
      session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
      });
      
      // Execute operations within transaction
      const result = await operations(session, db);
      
      // Commit transaction if all operations succeed
      await session.commitTransaction();
      
      // Log successful transaction
      ErrorLogger.log(
        new Error('Transaction committed successfully'),
        ErrorType.INFO,
        {
          transactionId: id,
          status: 'committed',
          timestamp: new Date().toISOString()
        }
      );
      
      return result;
      
    } catch (error) {
      // Abort transaction on any error
      if (session && session.inTransaction()) {
        await session.abortTransaction();
        
        ErrorLogger.log(
          new Error('Transaction aborted due to error'),
          ErrorType.DATABASE,
          {
            transactionId: id,
            status: 'aborted',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        );
      }
      
      // Log transaction failure
      ErrorLogger.log(
        error instanceof Error ? error : new Error('Transaction failed'),
        ErrorType.DATABASE,
        {
          transactionId: id,
          status: 'failed',
          timestamp: new Date().toISOString()
        }
      );
      
      throw error;
      
    } finally {
      // Always end session
      if (session) {
        await session.endSession();
      }
    }
  }
  
  /**
   * Generate unique transaction ID for tracking
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}