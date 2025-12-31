/**
 * Content Set Loader Service for 64 Logical Files
 * Handles 64 logical content sets (8 relationships × 8 occasions)
 * Each set has 10 variations, each variation has 20 screens, each screen has 6 emotional lines
 */

interface ContentScreen {
  lines: string[]  // 6 emotional lines per screen
}

interface ContentVariation {
  screens: ContentScreen[]  // 20 screens per variation
}

interface ContentSet {
  variations: ContentVariation[]  // 10 variations per set
}

export class ContentSetLoader64 {
  private static contentCache: Map<string, ContentSet> = new Map()
  
  /**
   * Get content for specific gender, relationship, and occasion using 64-file structure
   */
  static async getContentSet(
    gender: string,
    relation: string,
    occasion: string,
    senderName?: string,
    receiverName?: string
  ): Promise<{ variation: ContentVariation, source: string } | undefined> {
    
    try {
      // Normalize inputs for 64-file structure
      const normalizedGender = this.normalizeGender(gender)
      const normalizedRelation = this.normalizeRelation(relation, normalizedGender)
      const normalizedOccasion = this.normalizeOccasion(occasion)
      
      // Create content key for 64-file structure: gender_relation_occasion
      const contentKey = `${normalizedGender}_${normalizedRelation}_${normalizedOccasion}`
      
      console.log(`🔍 Loading 64-file content:`, {
        original: { gender, relation, occasion },
        normalized: { gender: normalizedGender, relation: normalizedRelation, occasion: normalizedOccasion },
        contentKey
      })
      
      // Try to get from cache first
      let contentSet = this.contentCache.get(contentKey)
      
      if (!contentSet) {
        // Load from content-sets folder
        contentSet = await this.loadContentSet(contentKey)
        if (contentSet) {
          this.contentCache.set(contentKey, contentSet)
        }
      }
      
      if (!contentSet || !contentSet.variations.length) {
        // Try fallback strategies
        contentSet = await this.tryFallbackContent(normalizedGender, normalizedRelation, normalizedOccasion)
        if (!contentSet) {
          console.log(`❌ No content found for: ${contentKey}`)
          return undefined
        }
      }
      
      // Randomly select one of the 10 variations
      const randomVariation = contentSet.variations[Math.floor(Math.random() * contentSet.variations.length)]
      
      return {
        variation: randomVariation,
        source: `content-sets/${contentKey}.js`
      }
      
    } catch (error) {
      console.error('Error loading 64-file content set:', error)
      return undefined
    }
  }
  
  /**
   * Normalize gender for 64-file structure
   */
  private static normalizeGender(gender: string): 'male' | 'female' {
    const genderLower = gender.toLowerCase()
    if (genderLower === 'female' || genderLower === 'f' || genderLower === 'woman') {
      return 'female'
    }
    return 'male'
  }
  
  /**
   * Normalize relationship values for 64-file structure
   */
  private static normalizeRelation(relation: string, gender: 'male' | 'female'): string {
    const relationLower = relation.toLowerCase()
    
    const relationMap: { [key: string]: string } = {
      'lover': 'lover',
      'spouse': 'lover',
      'friend': 'friend',
      'mom': 'mom',
      'mother': 'mom',
      'dad': 'dad',
      'father': 'dad',
      'sibling': 'sibling',
      'brother': 'sibling',
      'sister': 'sibling'
    }
    
    if (relationLower.includes('grandparent') || relationLower.includes('grandfather') || relationLower.includes('grandmother')) {
      return gender === 'male' ? 'dad' : 'mom'
    }
    
    const mapped = relationMap[relationLower]
    if (mapped) {
      if (mapped === 'mom' && gender === 'male') return 'mom'
      if (mapped === 'dad' && gender === 'female') return 'dad'
      return mapped
    }
    
    return 'friend'
  }
  
  /**
   * Normalize occasion values for 64-file structure
   */
  private static normalizeOccasion(occasion: string): string {
    const occasionLower = occasion.toLowerCase()
    
    const occasionMap: { [key: string]: string } = {
      'birthday': 'birthday',
      'anniversary': 'anniversary', 
      'graduation': 'graduation',
      'farewell': 'farewell',
      'apology': 'apology',
      'gratitude': 'gratitude',
      'encouragement': 'encouragement',
      'celebration': 'celebration',
      'thank you': 'gratitude',
      'thanks': 'gratitude',
      'sorry': 'apology',
      'good bye': 'farewell',
      'goodbye': 'farewell',
      'congrats': 'celebration',
      'congratulations': 'celebration',
      'encourage': 'encouragement',
      'grad': 'graduation'
    }
    
    return occasionMap[occasionLower] || 'birthday'
  }
  
  /**
   * Fix gender for logical parent relationships
   */
  private static fixGenderForParents(gender: 'male' | 'female', relation: string): 'male' | 'female' {
    if (relation === 'mom') return 'female'
    if (relation === 'dad') return 'male'
    return gender
  }
  
  /**
   * Try fallback content strategies
   */
  private static async tryFallbackContent(
    gender: 'male' | 'female', 
    relation: string, 
    occasion: string
  ): Promise<ContentSet | undefined> {
    
    const fixedGender = this.fixGenderForParents(gender, relation)
    
    const fallbackKeys = [
      ...(fixedGender !== gender ? [`${fixedGender}_${relation}_${occasion}`] : []),
      `${fixedGender}_${relation}_birthday`,
      `${fixedGender}_${relation}_celebration`,
      `${fixedGender}_friend_${occasion}`,
      `${fixedGender}_friend_birthday`
    ]
    
    for (const key of fallbackKeys) {
      try {
        const content = await this.loadContentSet(key)
        if (content) return content
      } catch (error) {
        // Continue
      }
    }
    
    return undefined
  }
  
  /**
   * Load content set ONLY from file system
   */
  private static async loadContentSet(contentKey: string): Promise<ContentSet | undefined> {
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(process.cwd(), 'content-sets', `${contentKey}.js`);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          
          // Improved extraction logic for variations
          const variationsMatch = fileContent.match(/variations:\s*(\[[\s\S]*?\])\s*,?\s*}/);
          if (variationsMatch && variationsMatch[1]) {
            try {
              // Using Function instead of eval for safer execution of JS object string
              const variations = new Function(`return ${variationsMatch[1]}`)();
              return { variations };
            } catch (parseError) {
              console.error(`Parse error for ${contentKey}:`, parseError);
            }
          }
        }
      }

      // Fallback to API if on client
      const baseUrl = typeof window !== 'undefined' ? '' : (process.env.APP_URL || 'http://localhost:3000');
      const response = await fetch(`${baseUrl}/api/content-sets/${contentKey}`)
      if (response.ok) {
        const contentSet = await response.json()
        if (contentSet && contentSet.variations) return contentSet
      }
      
      return undefined
    } catch (error) {
      console.error(`Error loading content set ${contentKey}:`, error)
      return undefined
    }
  }

  static getAvailable64ContentSets(): string[] {
    const genders = ['male', 'female']
    const relations = ['friend', 'lover', 'sibling', 'mom', 'dad']
    const occasions = ['birthday', 'anniversary', 'graduation', 'farewell', 'apology', 'gratitude', 'encouragement', 'celebration']
    
    const sets: string[] = []
    for (const gender of genders) {
      for (const relation of relations) {
        if ((relation === 'mom' && gender === 'male') || (relation === 'dad' && gender === 'female')) continue
        for (const occasion of occasions) {
          sets.push(`${gender}_${relation}_${occasion}`)
        }
      }
    }
    return sets
  }
}
