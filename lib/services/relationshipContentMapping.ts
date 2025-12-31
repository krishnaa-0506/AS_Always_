/**
 * Relationship Content Mapping Service
 * Maps relationship selections to appropriate content sets (64 logical sets)
 * 8 relationships × 8 occasions = 64 sets (removing impossible combinations)
 * Each set: 10 variations × 20 screens × 6 lines per screen
 */

import { ContentSetLoader64 } from './ContentSetLoader64'

interface ContentScreen {
  lines: string[]
}

interface ContentVariation {
  screens: ContentScreen[]
}

interface MappedContentResult {
  variation: ContentVariation  // ContentVariation with 20 screens
  source: string
}

export class RelationshipContentMapper {
  
  /**
   * Get content for specific relationship combination using 64-file structure
   * Randomly selects one variation from the matching set
   */
  static async getContentForRelationship(
    relationship: string,
    gender: string,
    receiverName: string,
    emotionTag?: string,
    occasion: string = 'birthday',
    senderName?: string
  ): Promise<MappedContentResult | null> {
    
    try {
      console.log(`🔍 RelationshipContentMapper: Using 64-file system`, {
        relationship, gender, receiverName, emotionTag, occasion, senderName
      })
      
      // Use the new 64-file ContentSetLoader
      const result = await ContentSetLoader64.getContentSet(
        gender,
        relationship,
        occasion,
        senderName,
        receiverName
      )
      
      if (!result) {
        console.warn(`❌ No content found for ${relationship} ${gender} ${occasion}`)
        return null
      }
      
      console.log(`✅ ContentSetLoader64 returned content:`, {
        contentScreens: result.variation.screens.length,
        source: result.source
      })
      
      return {
        variation: result.variation,
        source: result.source
      }
      
    } catch (error) {
      console.error('Error in RelationshipContentMapper.getContentForRelationship:', error)
      return null
    }
  }
  
  /**
   * Get available relationships for the 64-file system
   */
  static getAvailableRelationships(): string[] {
    return ['friend', 'lover', 'spouse', 'mom', 'dad', 'sibling', 'grandparent']
  }
  
  /**
   * Get available occasions for the 64-file system
   */
  static getAvailableOccasions(): string[] {
    return [
      'birthday', 'anniversary', 'graduation', 'farewell', 
      'apology', 'gratitude', 'encouragement', 'celebration'
    ]
  }
  
  /**
   * Get total number of logical content combinations (64-file system)
   */
  static getTotalContentSets(): number {
    // 8 logical relationships × 8 occasions = 64 sets
    // Each set has 10 variations = 640 total variations
    // Each variation has 20 screens = 12,800 total screens
    return 64
  }
  
  /**
   * Get all available relationships for a given gender in 64-file system
   */
  static getAvailableRelationships64(gender: string): Array<{value: string, label: string, emoji: string}> {
    const baseRelationships = [
      { value: 'lover', label: 'Lover/Partner', emoji: '💕' },
      { value: 'friend', label: 'Friend', emoji: '👫' },
      { value: 'sibling', label: 'Sibling', emoji: '👫' },
      { value: 'grandparent', label: 'Grandparent', emoji: '👴' }
    ]
    
    // Add gender-specific logical relationships
    if (gender === 'male') {
      baseRelationships.push({ value: 'dad', label: 'Dad', emoji: '👨' })
    } else if (gender === 'female') {
      baseRelationships.push({ value: 'mom', label: 'Mom', emoji: '👩' })
    } else {
      // For other genders, include both but will be mapped logically
      baseRelationships.push(
        { value: 'mom', label: 'Mom', emoji: '👩' },
        { value: 'dad', label: 'Dad', emoji: '👨' }
      )
    }
    
    return baseRelationships
  }
  
  /**
   * Validate relationship selection based on gender for 64-file system
   */
  static isValidRelationshipForGender64(relationship: string, gender: string): boolean {
    // In 64-file system, impossible combinations are handled by mapping
    // but we can warn about logical issues
    if (gender === 'male' && relationship === 'mom') {
      console.warn('⚠️ Male selected as mom relationship - will map to female_mom file')
    }
    
    if (gender === 'female' && relationship === 'dad') {
      console.warn('⚠️ Female selected as dad relationship - will map to male_dad file')
    }
    
    // All combinations are technically valid due to mapping
    return true
  }
}