/**
 * Content Uniqueness Service
 * Ensures each combination of sender/receiver/relationship generates unique content
 */

import { dbService } from '@/lib/db/mongodb'
import crypto from 'crypto'

interface ContentSession {
  sessionId: string
  senderName: string
  receiverName: string
  relationship: string
  tone: string
  usedQuotes: string[]
  usedNotes: string[]
  usedTransitions: string[]
  createdAt: Date
  lastUsed: Date
}

export class ContentUniquenessService {
  
  /**
   * Generate a unique session ID based on user inputs
   */
  static generateSessionId(senderName: string, receiverName: string, relationship: string): string {
    const input = `${senderName.toLowerCase()}-${receiverName.toLowerCase()}-${relationship.toLowerCase()}`
    return crypto.createHash('md5').update(input).digest('hex')
  }

  /**
   * Get or create a content session for tracking uniqueness
   */
  static async getContentSession(
    senderName: string, 
    receiverName: string, 
    relationship: string,
    tone: string
  ): Promise<ContentSession> {
    const sessionId = this.generateSessionId(senderName, receiverName, relationship)
    
    try {
      // Try to get existing session
      const existingSession = await dbService.getContentSession(sessionId)
      
      if (existingSession) {
        // Update last used time
        await dbService.updateContentSession(sessionId, {
          lastUsed: new Date(),
          tone: tone // Update tone if changed
        })
        return existingSession
      }
      
      // Create new session
      const newSession: Omit<ContentSession, '_id'> = {
        sessionId,
        senderName,
        receiverName,
        relationship,
        tone,
        usedQuotes: [],
        usedNotes: [],
        usedTransitions: [],
        createdAt: new Date(),
        lastUsed: new Date()
      }
      
      await dbService.createContentSession(newSession)
      return newSession as ContentSession
      
    } catch (error) {
      console.error('Error managing content session:', error)
      // Return a basic session if DB fails
      return {
        sessionId,
        senderName,
        receiverName,
        relationship,
        tone,
        usedQuotes: [],
        usedNotes: [],
        usedTransitions: [],
        createdAt: new Date(),
        lastUsed: new Date()
      } as ContentSession
    }
  }

  /**
   * Get unique quotes that haven't been used for this user combination
   */
  static getUniqueQuotes(
    allQuotes: string[], 
    usedQuotes: string[], 
    count: number = 10
  ): string[] {
    const availableQuotes = allQuotes.filter(quote => !usedQuotes.includes(quote))
    
    // If we've used all quotes, reset and start over with variations
    if (availableQuotes.length < count) {
      const shuffled = [...allQuotes].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    }
    
    // Return unique quotes
    const shuffled = [...availableQuotes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * Get unique notes that haven't been used for this user combination
   */
  static getUniqueNotes(
    allNotes: string[], 
    usedNotes: string[], 
    count: number = 8
  ): string[] {
    const availableNotes = allNotes.filter(note => !usedNotes.includes(note))
    
    if (availableNotes.length < count) {
      const shuffled = [...allNotes].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    }
    
    const shuffled = [...availableNotes].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  /**
   * Update session with used content to maintain uniqueness
   */
  static async updateUsedContent(
    sessionId: string,
    usedQuotes: string[],
    usedNotes: string[],
    usedTransitions: string[]
  ): Promise<void> {
    try {
      await dbService.updateContentSession(sessionId, {
        usedQuotes,
        usedNotes,
        usedTransitions,
        lastUsed: new Date()
      })
    } catch (error) {
      console.error('Error updating used content:', error)
    }
  }

  /**
   * Generate tone-specific variations for content
   */
  static generateToneVariations(baseContent: string, tone: string): string {
    const toneModifiers = {
      romantic: {
        prefix: ['My darling,', 'Sweetheart,', 'My love,', 'Dearest,'],
        suffix: ['❤️', '💕', '😘', '🥰'],
        intensifiers: ['deeply', 'passionately', 'completely', 'eternally']
      },
      playful: {
        prefix: ['Hey gorgeous!', 'Babe,', 'Cutie,', 'Beautiful,'],
        suffix: ['😄', '😉', '🤪', '😜'],
        intensifiers: ['totally', 'absolutely', 'definitely', 'super']
      },
      emotional: {
        prefix: ['From my heart,', 'With all my love,', 'Emotionally yours,'],
        suffix: ['💙', '🥺', '😢', '💗'],
        intensifiers: ['profoundly', 'deeply', 'genuinely', 'sincerely']
      },
      casual: {
        prefix: ['Hey,', 'Hi there,', 'Just wanted to say,'],
        suffix: ['😊', '🙂', '👍', '✨'],
        intensifiers: ['really', 'pretty', 'quite', 'very']
      }
    }

    const modifiers = toneModifiers[tone as keyof typeof toneModifiers] || toneModifiers.casual
    
    // Apply random tone modifications
    const shouldAddPrefix = Math.random() > 0.7
    const shouldAddSuffix = Math.random() > 0.8
    
    let modified = baseContent
    
    if (shouldAddPrefix && modifiers.prefix.length > 0) {
      const prefix = modifiers.prefix[Math.floor(Math.random() * modifiers.prefix.length)]
      modified = `${prefix} ${modified}`
    }
    
    if (shouldAddSuffix && modifiers.suffix.length > 0) {
      const suffix = modifiers.suffix[Math.floor(Math.random() * modifiers.suffix.length)]
      modified = `${modified} ${suffix}`
    }

    return modified
  }

  /**
   * Get analytics data for admin dashboard
   */
  static async getContentAnalytics() {
    try {
      const sessions = await dbService.getAllContentSessions()
      
      const analytics = {
        totalSessions: sessions.length,
        uniqueUsers: new Set(sessions.map(s => s.senderName.toLowerCase())).size,
        relationshipBreakdown: this.getRelationshipBreakdown(sessions),
        tonePreferences: this.getTonePreferences(sessions),
        contentUsageStats: this.getContentUsageStats(sessions),
        dailyActivity: this.getDailyActivity(sessions),
        averageSessionReuse: this.getSessionReuseStats(sessions)
      }
      
      return analytics
    } catch (error) {
      console.error('Error getting content analytics:', error)
      return null
    }
  }

  private static getRelationshipBreakdown(sessions: ContentSession[]) {
    const breakdown: { [key: string]: number } = {}
    sessions.forEach(session => {
      breakdown[session.relationship] = (breakdown[session.relationship] || 0) + 1
    })
    return breakdown
  }

  private static getTonePreferences(sessions: ContentSession[]) {
    const preferences: { [key: string]: number } = {}
    sessions.forEach(session => {
      preferences[session.tone] = (preferences[session.tone] || 0) + 1
    })
    return preferences
  }

  private static getContentUsageStats(sessions: ContentSession[]) {
    let totalQuotesUsed = 0
    let totalNotesUsed = 0
    
    sessions.forEach(session => {
      totalQuotesUsed += session.usedQuotes.length
      totalNotesUsed += session.usedNotes.length
    })
    
    return {
      totalQuotesUsed,
      totalNotesUsed,
      averageQuotesPerSession: sessions.length > 0 ? totalQuotesUsed / sessions.length : 0,
      averageNotesPerSession: sessions.length > 0 ? totalNotesUsed / sessions.length : 0
    }
  }

  private static getDailyActivity(sessions: ContentSession[]) {
    const dailyStats: { [key: string]: number } = {}
    
    sessions.forEach(session => {
      const date = session.createdAt.toISOString().split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })
    
    return dailyStats
  }

  private static getSessionReuseStats(sessions: ContentSession[]) {
    const reuseCounts = sessions.map(session => {
      const daysDiff = Math.floor(
        (session.lastUsed.getTime() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysDiff > 0 ? 1 : 0
    })
    
    const reuseCount = reuseCounts.filter(count => count > 0).length
    
    return {
      totalReusedSessions: reuseCount,
      reusePercentage: sessions.length > 0 ? (reuseCount / sessions.length) * 100 : 0
    }
  }
}