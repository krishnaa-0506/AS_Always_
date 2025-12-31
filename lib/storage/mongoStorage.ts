import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

interface FileMetadata {
  originalname: string;
  mimetype: string;
  size: number;
  uploadedBy?: string;
  messageId?: string;
  type?: 'image' | 'video' | 'audio' | 'voice' | 'document';
  uploadedAt: Date;
}

interface StoredFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  metadata: FileMetadata;
  uploadDate: Date;
}

class MongoFileStorage {
  private client: MongoClient;
  private bucket: GridFSBucket | null = null;
  private connected: boolean = false;

  constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      await this.client.connect();
      const db = this.client.db();
      this.bucket = new GridFSBucket(db, { 
        bucketName: process.env.MONGODB_STORAGE_BUCKET || 'asalways-files' 
      });
      this.connected = true;
      console.log('Connected to MongoDB GridFS');
    } catch (error) {
      console.error('Failed to connect to MongoDB GridFS:', error);
      throw error;
    }
  }

  async uploadFile(
    file: Buffer | Readable, 
    filename: string, 
    metadata: FileMetadata
  ): Promise<StoredFile> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket!.openUploadStream(filename, {
        metadata: {
          ...metadata,
          uploadedAt: new Date()
        }
      });

      uploadStream.on('error', reject);
      
      uploadStream.on('finish', () => {
        const storedFile: StoredFile = {
          id: uploadStream.id.toString(),
          filename: uploadStream.filename,
          originalname: metadata.originalname,
          mimetype: metadata.mimetype,
          size: metadata.size,
          url: `/api/files/${uploadStream.id.toString()}`,
          metadata,
          uploadDate: new Date()
        };
        resolve(storedFile);
      });

      if (file instanceof Buffer) {
        const readable = new Readable();
        readable.push(file);
        readable.push(null);
        readable.pipe(uploadStream);
      } else if (file && typeof (file as any).pipe === 'function') {
        (file as Readable).pipe(uploadStream);
      } else {
        throw new Error('Invalid file type - must be Buffer or Readable stream');
      }
    });
  }

  async getFile(fileId: string): Promise<{ stream: Readable; metadata: any } | null> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    try {
      const objectId = new ObjectId(fileId);
      
      // Get file metadata
      const fileInfo = await this.bucket.find({ _id: objectId }).toArray();
      if (fileInfo.length === 0) return null;

      // Create download stream
      const downloadStream = this.bucket.openDownloadStream(objectId);
      
      return {
        stream: downloadStream,
        metadata: fileInfo[0]
      };
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  }

  async getFileInfo(fileId: string): Promise<any | null> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    try {
      const objectId = new ObjectId(fileId);
      const files = await this.bucket.find({ _id: objectId }).toArray();
      return files.length > 0 ? files[0] : null;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    try {
      const objectId = new ObjectId(fileId);
      await this.bucket.delete(objectId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async listFiles(filter: any = {}, limit: number = 50, skip: number = 0): Promise<StoredFile[]> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    try {
      const files = await this.bucket
        .find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ uploadDate: -1 })
        .toArray();

      return files.map(file => ({
        id: file._id.toString(),
        filename: file.filename,
        originalname: file.metadata?.originalname || file.filename,
        mimetype: file.metadata?.mimetype || 'application/octet-stream',
        size: file.length,
        url: `/api/files/${file._id.toString()}`,
        metadata: (file.metadata || {}) as FileMetadata,
        uploadDate: file.uploadDate
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  async getFilesByMessage(messageId: string): Promise<StoredFile[]> {
    return this.listFiles({ 'metadata.messageId': messageId });
  }

  async getFilesByUser(userId: string): Promise<StoredFile[]> {
    return this.listFiles({ 'metadata.uploadedBy': userId });
  }

  async getFilesByType(type: string): Promise<StoredFile[]> {
    return this.listFiles({ 'metadata.type': type });
  }

  async cleanup(): Promise<void> {
    if (this.connected) {
      await this.client.close();
      this.connected = false;
      this.bucket = null;
    }
  }

  async getStorageStats(): Promise<any> {
    await this.connect();
    if (!this.bucket) throw new Error('GridFS bucket not initialized');

    try {
      const db = this.client.db();
      const bucketName = process.env.MONGODB_STORAGE_BUCKET || 'asalways-files';
      const stats = await db.collection(`${bucketName}.files`).aggregate([
        {
          $group: {
            _id: null,
            totalFiles: { $sum: 1 },
            totalSize: { $sum: '$length' },
            averageSize: { $avg: '$length' }
          }
        }
      ]).toArray();

      const typeStats = await db.collection(`${bucketName}.files`).aggregate([
        {
          $group: {
            _id: '$metadata.type',
            count: { $sum: 1 },
            totalSize: { $sum: '$length' }
          }
        }
      ]).toArray();

      return {
        overall: stats[0] || { totalFiles: 0, totalSize: 0, averageSize: 0 },
        byType: typeStats
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { overall: { totalFiles: 0, totalSize: 0, averageSize: 0 }, byType: [] };
    }
  }
}

export const mongoFileStorage = new MongoFileStorage();
export default MongoFileStorage;