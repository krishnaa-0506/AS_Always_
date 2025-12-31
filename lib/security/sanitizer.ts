import { ObjectId } from 'mongodb';
import { Memory } from '@/lib/types';

export class SecuritySanitizer {
  static sanitizeString(input: string): string {
    if (!input) return ''
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/>/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/["$\{\}]/g, '')
  }

  // New method for content that should be human-readable
  static sanitizeContent(input: string): string {
    if (!input) return ''
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/["$\{\}]/g, '')
      // Keep apostrophes and quotes readable for user content
  }

  // Decode HTML entities for display
  static decodeHTMLEntities(input: string): string {
    if (!input) return ''
    return input
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#x2F;/g, '/')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  }

  static sanitizeObject(input: any): any {
    if (typeof input === 'string') {
      return this.sanitizeString(input)
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(input)) {
        if (!key.startsWith('$')) {
          sanitized[key] = this.sanitizeObject(value)
        }
      }
      return sanitized
    }
    return input
  }

  static sanitizeForLogs(input: string): string {
    if (!input) return ''
    return input.replace(/[\r\n]/g, '_').replace(/[--]/g, '')
  }

  static validateObjectId(id: string): boolean {
    return ObjectId.isValid(id)
  }

  static sanitizeFilePath(path: string): string {
    if (!path) return ''
    return path.replace(/\.\./g, '').replace(/[<>:"|?*\\]/g, '').replace(/[-]/g, '')
  }

  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return ''
    
    // Basic email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) return ''
    
    // Sanitize to prevent injection attacks
    const sanitized = email
      .toLowerCase()
      .trim()
      .replace(/['";<>&]/g, '')
    
    // Revalidate after sanitization
    return emailRegex.test(sanitized) ? sanitized : ''
  }

  static sanitizeMemory(memory: Memory): Memory {
    return {
      ...memory,
      content: SecuritySanitizer.sanitizeString(memory.content), // Keep strict for file paths/URLs
      caption: memory.caption ? SecuritySanitizer.sanitizeContent(memory.caption) : undefined, // Use content sanitization for display text
      filename: memory.filename ? SecuritySanitizer.sanitizeString(memory.filename) : undefined // Keep strict for filenames
    };
  }

  // Legacy methods for backward compatibility
  static sanitizeMongoInput = this.sanitizeObject
  static sanitizeXSS = this.sanitizeString
  static sanitizeLog = this.sanitizeForLogs
}

// Export singleton instance
export const sanitizer = new SecuritySanitizer()