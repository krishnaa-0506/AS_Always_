import { DatabaseService } from './mongodb'

/**
 * Database optimization and indexing setup
 */
export class DatabaseOptimizer {
  private dbService: DatabaseService

  constructor() {
    this.dbService = new DatabaseService()
  }

  /**
   * Create all necessary indexes for optimal performance
   */
  async createAllIndexes(): Promise<void> {
    try {
      console.log('Starting database optimization...')

      await this.createUserIndexes()
      await this.createMessageIndexes()
      await this.createMemoryIndexes()
      await this.createScreenIndexes()
      await this.createPaymentIndexes()
      await this.createOTPIndexes()
      await this.createLogIndexes()

      console.log('Database optimization completed successfully')
    } catch (error) {
      console.error('Error creating indexes:', error)
      throw error
    }
  }

  /**
   * User collection indexes
   */
  private async createUserIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const users = db.collection('users')

    // Email index (unique, for login)
    await users.createIndex({ email: 1 }, { unique: true })

    // Role index (for filtering by role)
    await users.createIndex({ role: 1 })

    // Subscription status index
    await users.createIndex({ subscriptionStatus: 1 })

    // Created date index (for analytics)
    await users.createIndex({ createdAt: -1 })

    // Compound index for active subscribers
    await users.createIndex({ role: 1, subscriptionStatus: 1 })

    console.log('User indexes created')
  }

  /**
   * Message collection indexes
   */
  private async createMessageIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const messages = db.collection('messages')

    // Code index (unique, for quick lookup)
    await messages.createIndex({ code: 1 }, { unique: true })

    // Sender ID index
    await messages.createIndex({ senderId: 1 })

    // Receiver ID index
    await messages.createIndex({ receiverId: 1 })

    // Status index
    await messages.createIndex({ status: 1 })

    // Created date index (for sorting)
    await messages.createIndex({ createdAt: -1 })

    // Compound index for sender messages
    await messages.createIndex({ senderId: 1, createdAt: -1 })

    // Compound index for receiver messages
    await messages.createIndex({ receiverId: 1, status: 1 })

    // Compound index for viewed messages
    await messages.createIndex({ isViewed: 1, viewedAt: -1 })

    console.log('Message indexes created')
  }

  /**
   * Memory collection indexes
   */
  private async createMemoryIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const memories = db.collection('memories')

    // Message ID index (for fetching all memories of a message)
    await memories.createIndex({ messageId: 1 })

    // Type index
    await memories.createIndex({ type: 1 })

    // Compound index for message memories
    await memories.createIndex({ messageId: 1, type: 1 })

    // Created date index
    await memories.createIndex({ createdAt: -1 })

    console.log('Memory indexes created')
  }

  /**
   * AI Screen collection indexes
   */
  private async createScreenIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const screens = db.collection('screens')

    // Message ID index
    await screens.createIndex({ messageId: 1 })

    // Screen index (for ordering)
    await screens.createIndex({ screenIndex: 1 })

    // Compound index for message screens in order
    await screens.createIndex({ messageId: 1, screenIndex: 1 })

    // Created date index
    await screens.createIndex({ createdAt: -1 })

    console.log('Screen indexes created')
  }

  /**
   * Payment collection indexes
   */
  private async createPaymentIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const payments = db.collection('payments')

    // Transaction ID index (unique)
    await payments.createIndex({ transactionId: 1 }, { unique: true })

    // User ID index
    await payments.createIndex({ userId: 1 })

    // Status index
    await payments.createIndex({ status: 1 })

    // Email index
    await payments.createIndex({ userEmail: 1 })

    // Plan ID index
    await payments.createIndex({ planId: 1 })

    // Created date index
    await payments.createIndex({ createdAt: -1 })

    // Verified date index
    await payments.createIndex({ verifiedAt: -1 })

    // Compound index for user payments
    await payments.createIndex({ userId: 1, status: 1 })

    // Compound index for revenue calculation
    await payments.createIndex({ status: 1, verifiedAt: -1 })

    console.log('Payment indexes created')
  }

  /**
   * OTP collection indexes
   */
  private async createOTPIndexes(): Promise<void> {
    const db = await this.dbService.connect()
    const otps = db.collection('otps')

    // Email and purpose compound index
    await otps.createIndex({ email: 1, purpose: 1 })

    // Expiry date index (for cleanup)
    await otps.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    // Verified status index
    await otps.createIndex({ verified: 1 })

    console.log('OTP indexes created')
  }

  /**
   * Log collection indexes
   */
  private async createLogIndexes(): Promise<void> {
    const db = await this.dbService.connect()

    // Error logs
    try {
      const errorLogs = db.collection('error_logs')
      await errorLogs.createIndex({ timestamp: -1 })
      await errorLogs.createIndex({ level: 1 })
      await errorLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 }) // 30 days TTL
    } catch (error) {
      console.log('Error log collection may not exist yet')
    }

    // API logs
    try {
      const apiLogs = db.collection('api_logs')
      await apiLogs.createIndex({ timestamp: -1 })
      await apiLogs.createIndex({ endpoint: 1 })
      await apiLogs.createIndex({ statusCode: 1 })
      await apiLogs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 604800 }) // 7 days TTL
    } catch (error) {
      console.log('API log collection may not exist yet')
    }

    console.log('Log indexes created')
  }

  /**
   * Get index information for a collection
   */
  async getCollectionIndexes(collectionName: string): Promise<any[]> {
    const db = await this.dbService.connect()
    const collection = db.collection(collectionName)
    return await collection.indexes()
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    const db = await this.dbService.connect()
    return await db.stats()
  }

  /**
   * Analyze query performance
   */
  async analyzeQuery(collectionName: string, query: any): Promise<any> {
    const db = await this.dbService.connect()
    const collection = db.collection(collectionName)
    return await collection.find(query).explain('executionStats')
  }

  /**
   * Compact database (requires admin privileges)
   */
  async compactDatabase(): Promise<void> {
    try {
      const db = await this.dbService.connect()
      const collections = await db.listCollections().toArray()
      
      for (const collection of collections) {
        console.log(`Compacting collection: ${collection.name}`)
        await db.command({ compact: collection.name })
      }
      
      console.log('Database compaction completed')
    } catch (error) {
      console.error('Error compacting database:', error)
      throw error
    }
  }
}

export const databaseOptimizer = new DatabaseOptimizer()