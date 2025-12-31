import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { SecuritySanitizer } from '@/lib/security/sanitizer'
import { CSRFProtection } from '@/lib/middleware/csrf'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Validate code format (exactly 6 alphanumeric characters)
    if (!code || code.length !== 6 || !/^[A-Z0-9]{6}$/.test(code.toUpperCase())) {
      return NextResponse.json({
        success: false,
        error: 'Invalid code. Please enter a valid 6-character code.'
      }, { status: 400 })
    }

    const message = await dbService.findMessageByCode(code.toUpperCase())
    
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'No message found with this code. Please check and try again.'
      }, { status: 404 })
    }

    // Get related data
    const [memories, screens] = await Promise.all([
      dbService.getMemoriesByMessageId(message._id!.toString()),
      dbService.getScreensByMessageId(message._id!.toString())
    ])
    
    // If message is CREATED but content hasn't been generated, trigger generation
    if (message.status === 'CREATED' && screens.length === 0) {
      console.log('Message found but content not generated, triggering generation for code:', code)
      
      // Trigger content generation asynchronously
      try {
        const generateResponse = await fetch(`${request.nextUrl.origin}/api/generate-complete-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messageId: message._id!.toString(),
            currentUser: {
              id: message.senderId || 'anonymous',
              name: message.senderName || 'Anonymous'
            },
            senderName: message.senderName,
            receiverName: message.receiverName,
            relationship: message.relationship,
            receiverGender: message.receiverGender,
            emotionTag: message.emotionTag,
            textContent: message.textContent,
            voiceNote: message.voiceNote,
            memories: memories || []
          })
        })
        
        if (generateResponse.ok) {
          const generatedData = await generateResponse.json()
          console.log('Content generation triggered successfully for code:', code)
          
          // Fetch the updated screens after generation
          const updatedScreens = await dbService.getScreensByMessageId(message._id!.toString())
          message.screens = updatedScreens
        } else {
          console.error('Failed to generate content for code:', code)
          // Continue with empty screens, but log the error
        }
      } catch (genError) {
        console.error('Error triggering content generation:', genError)
        // Continue with empty screens
      }
    } else {
      message.screens = screens
    }
    
    message.memories = memories

    // Update message as viewed if it's the first time
    if (!message.isViewed) {
      await dbService.updateMessage(message._id!.toString(), {
        isViewed: true,
        viewedAt: new Date(),
        status: 'VIEWED'
      })
      console.log(`📊 Message marked as viewed - code: ${code}`)
    }

    const sanitizedMessage = {
      ...message,
      senderName: SecuritySanitizer.sanitizeContent(message.senderName || ''), // Use content sanitization for display names
      receiverName: SecuritySanitizer.sanitizeContent(message.receiverName || ''), // Use content sanitization for display names
      textContent: SecuritySanitizer.sanitizeContent(message.textContent || ''), // Use content sanitization for user text
      memories: (memories || []).map(memory => ({
        ...memory,
        content: SecuritySanitizer.sanitizeString(memory.content || ''), // Keep strict for file paths
        caption: SecuritySanitizer.sanitizeContent(memory.caption || '') // Use content sanitization for captions
      })),
      screens: (screens || []).map(screen => ({
        ...screen,
        content: SecuritySanitizer.sanitizeContent(screen.content || '') // Use content sanitization for screen content
      }))
    }
    
    // Ensure screens array is always present and log if empty
    if (!sanitizedMessage.screens || sanitizedMessage.screens.length === 0) {
      console.log(`⚠️ Warning: Message ${code} has no screens. Status: ${message.status}, Screens fetched: ${screens.length}`)
    }
    
    return NextResponse.json({
      success: true,
      message: sanitizedMessage
    })
  } catch (error) {
    console.error('Error fetching message by code:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch message'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    if (!CSRFProtection.validateToken(request)) {
      return NextResponse.json({ success: false, error: 'Invalid CSRF token' }, { status: 403 })
    }
    
    const { code } = params
    const data = await request.json()
    const sanitizedData = SecuritySanitizer.sanitizeObject(data)

    // Add a reaction to the message
    const message = await dbService.findMessageByCode(code.toUpperCase())

    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    const reaction = await dbService.addReaction({
      messageId: message._id!,
      type: SecuritySanitizer.sanitizeString(sanitizedData.type || 'HEART'),
      content: SecuritySanitizer.sanitizeString(sanitizedData.content || '')
    })

    return NextResponse.json({
      success: true,
      reaction
    })
  } catch (error) {
    console.error('Error adding reaction:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add reaction'
    }, { status: 500 })
  }
}