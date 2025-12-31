import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function GET(req: NextRequest) {
  try {
    // Get all messages for debugging
    const messages = await dbService.getMessages(undefined, 100, 0);
    
    console.log('All messages in database:', messages);
    
    // Find messages with codes
    const messagesWithCodes = messages.messages.filter(msg => msg.code);
    
    return NextResponse.json({
      totalMessages: messages.total,
      messagesWithCodes: messagesWithCodes.length,
      codes: messagesWithCodes.map(msg => ({
        code: msg.code,
        status: msg.status,
        createdAt: msg.createdAt,
        id: msg._id
      }))
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}