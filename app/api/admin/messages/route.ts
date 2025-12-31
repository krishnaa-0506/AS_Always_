import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

// Simple admin authentication
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || '306206'

function authenticateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminCode = request.headers.get('x-admin-code')
  const adminCookie = request.cookies.get('asalways-admin')?.value
  
  return adminCookie === 'authenticated' || adminCode === ADMIN_SECRET_CODE || authHeader === `Bearer ${ADMIN_SECRET_CODE}`
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const { messages, total } = await dbService.getMessages(undefined, limit, offset)
    
    // Get related data for each message
    const messagesWithDetails = await Promise.all(
      messages.map(async (message) => {
        const [memories, screens] = await Promise.all([
          dbService.getMemoriesByMessageId(message._id!.toString()),
          dbService.getScreensByMessageId(message._id!.toString())
        ])
        
        return {
          id: message._id,
          ...message,
          memoriesCount: memories.length,
          screensCount: screens.length
        }
      })
    )

    return NextResponse.json({
      success: true,
      messages: messagesWithDetails,
      total,
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total
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

export async function DELETE(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const { messageId } = await request.json()
    
    if (!messageId) {
      return NextResponse.json({
        success: false,
        error: 'Message ID is required'
      }, { status: 400 })
    }

    // Get message details before deletion
    const message = await dbService.getMessageById(messageId)
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    // Delete related data first
    await Promise.all([
      dbService.deleteMemoriesByMessageId(messageId),
      dbService.deleteScreensByMessageId(messageId)
    ])

    // Delete the message
    const result = await dbService.deleteMessage(messageId)
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: `Message ${message.code} deleted successfully`,
        deletedCode: message.code
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete message'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete message'
    }, { status: 500 })
  }
}