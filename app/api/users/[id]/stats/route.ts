import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { authService } from '@/lib/auth/jwt'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = await authService.authenticateRequest(request)
    if (!user || user.userId !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await dbService.connect()
    
    // Get user's message statistics
    const [
      totalMessages,
      viewedMessages,
      totalReactions
    ] = await Promise.all([
      db.collection('messages').countDocuments({ senderId: params.id }),
      db.collection('messages').countDocuments({ senderId: params.id, isViewed: true }),
      db.collection('reactions').countDocuments({ 
        messageId: { 
          $in: await db.collection('messages')
            .find({ senderId: params.id })
            .project({ _id: 1 })
            .toArray()
            .then(docs => docs.map(doc => doc._id.toString()))
        }
      })
    ])

    return NextResponse.json({
      messages: totalMessages,
      viewed: viewedMessages,
      hearts: totalReactions
    })

  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}