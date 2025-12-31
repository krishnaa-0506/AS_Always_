import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  try {
    // Check if LTXB59 exists
    const existingMessage = await dbService.findMessageByCode('LTXB59')
    
    if (existingMessage) {
      return NextResponse.json({
        success: true,
        message: 'Code LTXB59 already exists',
        data: {
          code: existingMessage.code,
          status: existingMessage.status,
          createdAt: existingMessage.createdAt,
          id: existingMessage._id
        }
      })
    }

    // Create LTXB59 message if it doesn't exist
    const newMessage = await dbService.createMessage({
      code: 'LTXB59',
      senderName: 'Test Sender',
      receiverName: 'Test Receiver',
      relationship: 'romantic_partner',
      receiverGender: 'female',
      emotionTag: 'love',
      selectedSong: 'acoustic-love-1',
      voiceNote: null,
      textContent: 'This is a test message for code LTXB59',
      senderId: 'test-sender-id',
      receiverId: 'test-receiver-id',
      status: 'CREATED',
      isViewed: false
    })

    return NextResponse.json({
      success: true,
      message: 'Code LTXB59 created successfully',
      data: {
        code: newMessage.code,
        status: newMessage.status,
        createdAt: newMessage.createdAt,
        id: newMessage._id
      }
    })

  } catch (error) {
    console.error('Error creating/checking LTXB59:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create/check code', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if LTXB59 exists
    const existingMessage = await dbService.findMessageByCode('LTXB59')
    
    if (existingMessage) {
      return NextResponse.json({
        success: true,
        message: 'Code LTXB59 already exists',
        data: {
          code: existingMessage.code,
          status: existingMessage.status,
          createdAt: existingMessage.createdAt,
          id: existingMessage._id
        }
      })
    }

    // Create LTXB59 message if it doesn't exist
    const newMessage = await dbService.createMessage({
      code: 'LTXB59',
      senderName: 'Test Sender',
      receiverName: 'Test Receiver',
      relationship: 'romantic_partner',
      receiverGender: 'female',
      emotionTag: 'love',
      selectedSong: 'acoustic-love-1',
      voiceNote: null,
      textContent: 'This is a test message for code LTXB59',
      senderId: 'test-sender-id',
      receiverId: 'test-receiver-id',
      status: 'CREATED',
      isViewed: false
    })

    return NextResponse.json({
      success: true,
      message: 'Code LTXB59 created successfully',
      data: {
        code: newMessage.code,
        status: newMessage.status,
        createdAt: newMessage.createdAt,
        id: newMessage._id
      }
    })

  } catch (error) {
    console.error('Error creating/checking LTXB59:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create/check code', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}