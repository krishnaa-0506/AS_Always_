import { NextRequest } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { SecuritySanitizer } from '../security/sanitizer'

interface ProcessedFile {
  success: boolean
  filename?: string
  url?: string
  size?: number
  dimensions?: { width: number; height: number }
  duration?: number
  error?: string
}

export class FileProcessor {
  private uploadDir: string
  private maxFileSize: number
  private allowedTypes: Record<string, string[]>

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './public/uploads'
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '50000000') // 50MB
    this.allowedTypes = {
      photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'],
      video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mov'],
      voice: ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4', 'audio/ogg', 'audio/m4a']
    }
  }

  async processUpload(request: NextRequest, type: 'photo' | 'video' | 'voice'): Promise<ProcessedFile> {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
        return { success: false, error: 'No file provided' }
      }

      // Validate file
      const validation = this.validateFile(file, type)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Create upload directory
      const typeDir = path.join(this.uploadDir, type)
      await this.ensureDirectory(typeDir)

      // Generate unique filename with additional security checks
      const sanitizedName = SecuritySanitizer.sanitizeFilePath(file.name)
      const filename = this.generateFilename(sanitizedName)
      
      // Additional path traversal prevention
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return { success: false, error: 'Invalid filename' }
      }
      
      const filepath = path.resolve(typeDir, filename)
      
      // Strict path traversal prevention
      const normalizedTypeDir = path.resolve(typeDir)
      const normalizedFilePath = path.resolve(filepath)
      if (!normalizedFilePath.startsWith(normalizedTypeDir + path.sep) && normalizedFilePath !== normalizedTypeDir) {
        return { success: false, error: 'Path traversal attempt detected' }
      }

      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)

      return {
        success: true,
        filename,
        size: buffer.length,
        url: this.getFileUrl(filename, type)
      }
    } catch (error) {
      console.error('File upload error:', error)
      return { success: false, error: 'Upload failed' }
    }
  }

  private validateFile(file: File, type: string): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return { valid: false, error: `File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB` }
    }

    // Check file type
    if (!this.allowedTypes[type]?.includes(file.type)) {
      return { valid: false, error: `Invalid file type. Allowed: ${this.allowedTypes[type]?.join(', ')}` }
    }

    // Check for malicious files
    if (this.isSuspiciousFile(file.name)) {
      return { valid: false, error: 'File type not allowed for security reasons' }
    }

    return { valid: true }
  }

  private isSuspiciousFile(filename: string): boolean {
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.jar', '.js', '.vbs', '.ps1']
    const ext = path.extname(filename).toLowerCase()
    return suspiciousExtensions.includes(ext)
  }

  private async ensureDirectory(dir: string): Promise<void> {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
  }

  private generateFilename(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = path.extname(originalName)
    const safeName = path.basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20)
    return `${timestamp}_${random}_${safeName}${extension}`
  }

  getFileUrl(filename: string, type: 'photo' | 'video' | 'voice'): string {
    return `/uploads/${type}/${filename}`
  }

  async deleteFile(filename: string, type: 'photo' | 'video' | 'voice'): Promise<boolean> {
    try {
      const sanitizedFilename = SecuritySanitizer.sanitizeFilePath(filename)
      
      // Additional filename validation
      if (sanitizedFilename.includes('..') || sanitizedFilename.includes('/') || sanitizedFilename.includes('\\')) {
        return false
      }
      
      const typeDir = path.resolve(this.uploadDir, type)
      const filepath = path.resolve(typeDir, sanitizedFilename)
      
      // Strict path traversal prevention
      if (!filepath.startsWith(typeDir + path.sep) && filepath !== typeDir) {
        return false
      }
      if (existsSync(filepath)) {
        await unlink(filepath)
        return true
      }
      return false
    } catch (error) {
      console.error('File deletion error:', error)
      return false
    }
  }

  async cleanupOldFiles(): Promise<void> {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days

    try {
      const types = ['photo', 'video', 'voice'] as const
      for (const type of types) {
        const typeDir = path.join(this.uploadDir, type)
        if (!existsSync(typeDir)) continue

        const { readdir, stat } = await import('fs/promises')
        const files = await readdir(typeDir)
        
        for (const file of files) {
          const filePath = path.join(typeDir, file)
          const stats = await stat(filePath)
          
          if (stats.mtime < cutoffDate) {
            await unlink(filePath)
            console.log(`Cleaned up old file: ${file}`)
          }
        }
      }
    } catch (error) {
      console.error('File cleanup error:', error)
    }
  }
}

export const fileProcessor = new FileProcessor()

// Run cleanup daily
setInterval(() => {
  fileProcessor.cleanupOldFiles()
}, 24 * 60 * 60 * 1000)