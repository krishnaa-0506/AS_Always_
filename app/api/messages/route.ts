import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const status = url.searchParams.get('status')

    const { messages, total } = await dbService.getMessages(userId || undefined, limit, offset)
    
    // Filter by status if provided
    let filteredMessages = messages
    if (status) {
      filteredMessages = messages.filter(msg => msg.status === status)
    }
    
    // Get memory and screen counts for each message
    const messagesWithCounts = await Promise.all(
      filteredMessages.map(async (msg) => {
        const [memories, screens] = await Promise.all([
          dbService.getMemoriesByMessageId(msg._id!.toString()),
          dbService.getScreensByMessageId(msg._id!.toString())
        ])
        
        return {
          id: msg._id,
          code: msg.code,
          senderName: msg.senderName,
          receiverName: msg.receiverName,
          relationship: msg.relationship,
          status: msg.status,
          isViewed: msg.isViewed,
          viewedAt: msg.viewedAt,
          createdAt: msg.createdAt,
          memoriesCount: memories.length,
          screensCount: screens.length
        }
      })
    )

    return NextResponse.json({ 
      success: true, 
      messages: messagesWithCounts,
      total,
      pagination: {
        limit,
        offset,
        hasMore: total > offset + limit
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch messages' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate a unique 6-character code
    const generateCode = async () => {
      let code: string
      let exists = true
      
      while (exists) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        code = ''
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        
        // Check if code already exists
        const existing = await dbService.findMessageByCode(code)
        exists = !!existing
      }
      
      return code!
    }

    const code = await generateCode()

    // Create the message with all related data
    const newMessage = await dbService.createMessage({
      code,
      senderName: data.senderName,
      receiverName: data.receiverName,
      relationship: data.relationship,
      receiverGender: data.receiverGender,
      emotionTag: data.emotionTag,
      selectedSong: data.selectedSong,
      voiceNote: data.voiceNote,
      textContent: data.textContent,
      senderId: data.senderId,
      receiverId: data.receiverId,
      status: 'CREATED',
      isViewed: false
    })

    // If memories are included, create them
    if (data.memories && Array.isArray(data.memories)) {
      await Promise.all(
        data.memories.map((memory: any, index: number) =>
          dbService.addMemory({
            messageId: newMessage._id!,
            type: memory.type,
            content: memory.content,
            filename: memory.filename,
            caption: memory.caption,
            order: index
          })
        )
      )
    }

    // Update message count in user's history (this is handled by the database query)
    // The message is automatically saved to history when created

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      code: newMessage.code,
      totalCount: 1 // This will be updated when client fetches messages
    })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create message' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    const updatedMessage = await dbService.updateMessage(id, updateData)

    if (!updatedMessage) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: updatedMessage
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update message'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Message ID is required'
      }, { status: 400 })
    }

    // For now, we'll just mark as deleted rather than actually deleting
    const updatedMessage = await dbService.updateMessage(id, { status: 'DELETED' })

    if (!updatedMessage) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete message'
    }, { status: 500 })
  }
}