import { MongoClient, Db } from 'mongodb'

class DatabaseConnection {
  private client: MongoClient | null = null
  private db: Db | null = null

  async connect(): Promise<Db> {
    if (this.db) return this.db

    const uri = process.env.MONGODB_URI!
    this.client = new MongoClient(uri)
    await this.client.connect()
    this.db = this.client.db('asalways')
    
    // Create indexes for performance
    await this.createIndexes()
    return this.db
  }

  private async createIndexes() {
    if (!this.db) return

    await Promise.all([
      this.db.collection('users').createIndex({ email: 1 }, { unique: true }),
      this.db.collection('messages').createIndex({ code: 1 }, { unique: true }),
      this.db.collection('messages').createIndex({ senderId: 1 }),
      this.db.collection('memories').createIndex({ messageId: 1 }),
      this.db.collection('screens').createIndex({ messageId: 1, screenIndex: 1 })
    ])
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

export const dbConnection = new DatabaseConnection()