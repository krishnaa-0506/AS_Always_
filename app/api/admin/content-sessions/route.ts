import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

// Ensure this route is dynamic (accesses database)
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessions = await dbService.getAllContentSessions()
    
    return NextResponse.json({
      success: true,
      sessions: sessions || []
    })
  } catch (error) {
    console.error('Error fetching content sessions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content sessions',
      sessions: []
    }, { status: 500 })
  }
}