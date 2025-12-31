import { NextRequest, NextResponse } from 'next/server'
import { RelationshipContentMapper } from '@/lib/services/relationshipContentMapping'
import { templates, Template } from '@/lib/data/random-templates'
import { dbService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

interface ContentGenerationRequest {
  senderName: string
  receiverName: string
  relationship: string
  receiverGender: string
  occasion?: string  // Add occasion parameter
  emotionTag?: string
  textContent?: string
  receiverMemory?: string
  messageId?: string  // Add optional messageId for saving screens
}

export async function POST(request: NextRequest) {
  try {
    const body: ContentGenerationRequest = await request.json()
    const { 
      senderName, 
      receiverName, 
      relationship, 
      receiverGender, 
      occasion = 'birthday',  // Default to birthday
      emotionTag,
      textContent,
      receiverMemory,
      messageId
    } = body

    console.log('🎬 Generating content from 64-file structure:', {
      senderName,
      receiverName, 
      relationship,
      receiverGender,
      occasion,
      emotionTag,
      receiverMemory
    })

    // Step 1: Get content from content-sets folder (64 logical sets structure)
    console.log('📚 Step 1: Loading content from 64-file structure...')
    const contentResult = await RelationshipContentMapper.getContentForRelationship(
      relationship,
      receiverGender,
      receiverName,
      emotionTag || 'warm',
      occasion,
      senderName
    )

    if (!contentResult) {
      return NextResponse.json({
        success: false,
        error: `No content available for ${receiverGender} ${relationship} ${occasion}`
      }, { status: 404 })
    }

    console.log(`✅ Content loaded: ${contentResult.source}`)
    console.log(`📊 Generated content with 20 screens`)

    // Step 2: Auto-select universal template
    console.log('🎨 Step 2: Using Universal Template...')
    const template = selectRandomTemplateForContent(relationship, emotionTag || 'warm')
    console.log(`✅ Template: ${template.name} (adapts colors for ${relationship})`)

    // Step 3: Content is already processed (20 screens ready)
    console.log('🎭 Step 3: Content already processed with 6-line emotional format...')
    const variation = contentResult.variation
    if (!variation || !variation.screens) {
      return NextResponse.json({
        success: false,
        error: 'Invalid content structure'
      }, { status: 500 })
    }

    // Step 4: Create formatted screens with placeholders replaced
    // IMPORTANT: Add personal message as FIRST screen if provided
    const processedScreens: any[] = []
    
    // Add personal message as FIRST screen if provided
    if (textContent && textContent.trim()) {
      processedScreens.push({
        id: `screen_personal`,
        type: 'personal_message',
        content: textContent.trim(),
        lines: textContent.trim().split('\n').filter(l => l.trim()),
        template: template.id,
        animation: 'fadeIn',
        style: {
          background: 'gradient',
          textColor: '#ffffff',
          font: 'Playfair Display'
        }
      })
    }
    
    // Then add the 20 content screens
    const contentScreens = variation.screens.map((screen: any, index: number) => {
      const processedLines = screen.lines.map((line: string) =>
        line
          .replace(/\{\{receiverName\}\}/g, receiverName)
          .replace(/\{\{specialMemory\}\}/g, (receiverMemory && receiverMemory.trim()) ? receiverMemory.trim() : `that wonderful memory we shared`)
          .replace(/\{\{specificMemory\}\}/g, (receiverMemory && receiverMemory.trim()) ? receiverMemory.trim() : `that wonderful memory we shared`)
          .replace(/\{\{gratefulFor\}\}/g, `your amazing presence in my life`)
      )

      return {
        id: `screen_${index + 1}`,
        type: 'content',
        content: processedLines.join('\n'), // Join with newlines for line-by-line display
        lines: processedLines,
        template: template.id,
        animation: 'fadeInUp',
        style: {
          background: 'gradient',
          textColor: '#ffffff',
          font: 'Playfair Display'
        }
      }
    })
    
    processedScreens.push(...contentScreens)

    // Step 6: Get unique code (Use existing if available)
    let code = '';
    if (messageId) {
      try {
        const existingMessage = await dbService.getMessageById(messageId);
        if (existingMessage && existingMessage.code) {
          code = existingMessage.code;
          console.log(`📝 Using existing code: ${code}`);
        }
      } catch (e) {
        console.error('Error getting existing message:', e);
      }
    }
    
    if (!code) {
      code = generateUniqueCode();
      console.log(`📝 Generated NEW code: ${code}`);
    }

    // Step 7: Get memories (images) from message and distribute across screens
    let imageMemories: any[] = []
    if (messageId) {
      try {
        const allMemories = await dbService.getMemoriesByMessageId(messageId)
        // Filter only images (max 5) and get ImageKit URLs
        imageMemories = allMemories
          .filter(m => m.type === 'PHOTO' && m.content) // Only images with content
          .slice(0, 5) // Max 5 images
          .map(m => ({
            url: m.content, // ImageKit URL
            caption: m.caption,
            index: allMemories.indexOf(m)
          }))
        console.log(`📸 Found ${imageMemories.length} images to distribute across screens`)
      } catch (memError) {
        console.error('❌ Error fetching memories:', memError)
      }
    }

    // Step 8: Save screens and code to database if messageId is provided
    if (messageId) {
      console.log('💾 Saving generated screens and code to database for message:', messageId)
      try {
        // Distribute images across screens (max 5 images, one per screen)
        // Place images at fixed positions (screens 7–11) for predictable experience
        const imageDistribution: number[] = []
        if (imageMemories.length > 0) {
          const totalScreens = processedScreens.length

          // Target indices for screens 7–11 (0-based indices 6–10)
          const preferred = [6, 7, 8, 9, 10]
          const validPreferred = preferred
            .filter((i) => i >= 0 && i < totalScreens - 1) // never place on last screen
            .slice(0, 5)

          for (let i = 0; i < imageMemories.length && i < validPreferred.length; i++) {
            imageDistribution.push(validPreferred[i])
          }

          console.log(`📸 Distributing ${imageMemories.length} images at fixed screen indices (7–11):`, imageDistribution)
        }

        // Convert screens to database format with image information
        // Only save essential data - remove unwanted fields
        const dbScreens = processedScreens.map((screen, index) => {
          const imageIndex = imageDistribution.indexOf(index)
          const hasImage = imageIndex !== -1
          const imageData = hasImage ? imageMemories[imageIndex] : null

          // Determine screen type
          let screenType = screen.type
          if (!screenType) {
            if (index === 0) {
              screenType = 'intro'
            } else if (index === processedScreens.length - 1) {
              screenType = 'final'
            } else {
              screenType = 'memory'
            }
          }

          // If we attached an image, force screen to be a photo screen
          if (hasImage) {
            screenType = 'photo'
          }

          // Only save essential fields to DB
          return {
            messageId,
            screenIndex: index,
            type: screenType,
            content: screen.content, // Save the actual content
            background: screen.style?.background || 'gradient',
            animation: screen.animation || 'fadeIn',
            duration: 6000,
            emotion: 'warm',
            hasImage: hasImage,
            imageUrl: imageData?.url || undefined,
            imageIndex: hasImage ? imageIndex : undefined
          }
        })

        // Save screens to database
        await dbService.addScreens(dbScreens)
        console.log(`✅ Saved ${dbScreens.length} screens to database`)
        console.log(`📋 Screen list saved:`, dbScreens.map(s => ({ index: s.screenIndex, type: s.type, hasImage: s.hasImage })))

        // Update message with code and status to GENERATED
        const message = await dbService.updateMessage(messageId, { 
          code: code,
          status: 'GENERATED',
          generatedAt: new Date()
        })
        console.log(`✅ Updated message status to GENERATED with code: ${code}`)

        // Increment message count - message is now fully generated and ready
        // The message count is automatically tracked via the messages collection
        // Status change to GENERATED indicates the message is complete
        if (message) {
          console.log(`📊 Message generation complete - count tracked for sender: ${message.senderId || 'anonymous'}`)
          // Message count is automatically available via:
          // - GET /api/messages?userId=X (returns count)
          // - GET /api/users/[id]/stats (returns totalMessages count)
        }

      } catch (saveError) {
        console.error('❌ Failed to save screens to database:', saveError)
        // Don't fail the entire request if saving fails
      }
    }

    // Step 8: Create response with all necessary data
    const response = {
      success: true,
      message: 'Content generated successfully',
      data: {
        code: code,
        screens: processedScreens,
        template: template,
        contentSource: contentResult.source,
        metadata: {
          senderName,
          receiverName,
          relationship,
          receiverGender,
          emotionTag,
          screenCount: processedScreens.length,
          hasPersonalMessage: !!textContent,
          generatedAt: new Date().toISOString()
        }
      }
    }

    console.log(`🎉 Content generation complete! Generated ${processedScreens.length} screens using ${contentResult.source}`)
    console.log(`📝 Generated code: ${code}`)

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Content generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Randomly select template based on relationship and emotion
 */
function selectRandomTemplateForContent(relationship: string, emotion: string): Template {
  // Template pools based on relationship and emotion
  const templatePools: Record<string, string[]> = {
    lover: ['template_001_romantic_sunset', 'template_031_ruby_passion', 'template_004_playful_hearts', 'template_016_passionate_red'],
    spouse: ['template_001_romantic_sunset', 'template_031_ruby_passion', 'template_040_champagne_gold', 'template_032_emerald_dream'],
    mom: ['template_005_ocean_breeze', 'template_036_forest_green', 'template_047_cherry_blossom', 'template_035_peach_sunset'],
    dad: ['template_033_sapphire_sky', 'template_042_ocean_depth', 'template_046_slate_modern', 'template_018_energetic_blue'],
    friend: ['template_043_sunny_yellow', 'template_034_coral_breeze', 'template_045_lime_fresh', 'template_023_tropical_paradise'],
    sibling: ['template_034_coral_breeze', 'template_043_sunny_yellow', 'template_045_lime_fresh', 'template_023_tropical_paradise'],
    grandparent: ['template_040_champagne_gold', 'template_015_golden_honey', 'template_049_golden_dawn', 'template_032_emerald_dream']
  }

  // Emotion-based template modifiers
  const emotionModifiers: Record<string, string[]> = {
    birthday: ['template_004_playful_hearts', 'template_043_sunny_yellow'],
    anniversary: ['template_001_romantic_sunset', 'template_040_champagne_gold'],
    graduation: ['template_033_sapphire_sky', 'template_036_forest_green'],
    farewell: ['template_041_rose_quartz', 'template_005_ocean_breeze'],
    apology: ['template_041_rose_quartz', 'template_035_peach_sunset'],
    gratitude: ['template_015_golden_honey', 'template_047_cherry_blossom'],
    encouragement: ['template_043_sunny_yellow', 'template_036_forest_green'],
    celebration: ['template_004_playful_hearts', 'template_034_coral_breeze']
  }

  // Get relationship templates
  const relationshipTemplates = templatePools[relationship] || templatePools.friend
  
  // Add emotion-specific templates if available
  const emotionTemplates = emotionModifiers[emotion] || []
  
  // Combine and deduplicate
  const allTemplates = Array.from(new Set([...relationshipTemplates, ...emotionTemplates]))
  
  // Randomly select from available templates
  const randomIndex = Math.floor(Math.random() * allTemplates.length)
  const selectedTemplateId = allTemplates[randomIndex]
  
  console.log(`🎲 Selected from ${allTemplates.length} templates: ${selectedTemplateId}`)
  
  // Get the actual template by ID
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)
  
  // Return the specific template or fallback to random
  return selectedTemplate || templates[0] // Always use universal template
}

/**
 * Generate unique 6-character alphanumeric code
 */
function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}