import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase()
    const message = await dbService.getMessageByCode(code)
    
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      reactions: message.reactions || [],
      hasReaction: (message.reactions || []).length > 0
    })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reactions'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { type } = await request.json()
    
    // Validate reaction type
    if (!type || !['heart', 'love', 'like'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid reaction type'
      }, { status: 400 })
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'

    // Get message by code first (ensure uppercase)
    const code = params.code.toUpperCase()
    const message = await dbService.getMessageByCode(code)
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    // Check if this IP already reacted (simple rate limiting)
    const existingReaction = message.reactions?.find(
      (r: any) => r.ip === clientIP && r.type === type
    )
    
    if (existingReaction) {
      return NextResponse.json({
        success: false,
        error: 'You have already reacted to this message',
        alreadyReacted: true
      }, { status: 429 })
    }

    // Add reaction to message
    const reaction = {
      type: type,
      timestamp: new Date(),
      ip: clientIP
    }

    const updatedMessage = await dbService.addMessageReaction(code, reaction)
    
    if (!updatedMessage) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update message'
      }, { status: 500 })
    }
    
    // Return optimized response
    return NextResponse.json({
      success: true,
      message: 'Reaction added successfully',
      reaction: {
        type: reaction.type,
        timestamp: reaction.timestamp
      },
      stats: {
        totalReactions: updatedMessage.reactions?.length || 1,
        hearts: updatedMessage.reactions?.filter((r: any) => r.type === 'heart').length || 0
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Reaction error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add reaction'
    }, { status: 500 })
  }
}