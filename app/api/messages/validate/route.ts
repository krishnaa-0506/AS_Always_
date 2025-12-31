import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    console.log('Validating code:', code);

    if (!code || typeof code !== 'string') {
      console.log('Invalid code format - empty or wrong type');
      return NextResponse.json(
        { error: 'Please enter a valid code' },
        { status: 400 }
      )
    }

    // Sanitize and normalize code format
    const sanitizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    console.log('Sanitized code:', sanitizedCode);

    if (sanitizedCode.length !== 6) {
      console.log('Invalid code length:', sanitizedCode.length);
      return NextResponse.json(
        { error: 'Code must be 6 characters long' },
        { status: 400 }
      )
    }

    // Check if message exists in database
    console.log('Searching for message with code:', sanitizedCode);
    const message = await dbService.findMessageByCode(sanitizedCode);

    if (!message) {
      console.log('No message found for code:', sanitizedCode);
      
      // Try to find any messages in the database for debugging
      const allMessages = await dbService.getMessages(undefined, 5, 0);
      console.log('Total messages in database:', allMessages.total);
      console.log('Recent codes:', allMessages.messages.map(m => m.code).filter(Boolean));
      
      return NextResponse.json(
        { 
          valid: false, 
          error: 'This code is not valid. Please check and try again.',
          details: 'If you just received this code, please wait a few moments and try again.',
          debug: {
            searchedCode: sanitizedCode,
            totalMessages: allMessages.total,
            availableCodes: allMessages.messages.map(m => m.code).filter(Boolean)
          }
        },
        { status: 200 }
      )
    }

    console.log('Message found for code:', sanitizedCode);
    
    // Additional validation checks
    if (message.status !== 'GENERATED' && message.status !== 'CREATED' && message.status !== 'VIEWED') {
      console.log('Message not ready, status:', message.status);
      return NextResponse.json(
        {
          valid: false,
          error: 'This message is not ready yet. Please try again in a moment.',
          details: 'The message is still being processed.'
        },
        { status: 200 }
      )
    }

    // If message is CREATED but not GENERATED, let the receiver page handle content generation
    if (message.status === 'CREATED') {
      console.log('Message found but content not generated yet, status:', message.status);
      return NextResponse.json(
        { 
          valid: true,
          messageId: message._id,
          needsGeneration: true,
          status: message.status
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        valid: true,
        messageId: message._id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error validating message code:', error)
    return NextResponse.json(
      { error: 'Failed to validate code' },
      { status: 500 }
    )
  }
}
