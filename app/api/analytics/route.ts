import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30')
    
    const analytics = await dbService.getAnalytics(days)
    
    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()
    
    switch (type) {
      case 'user_created':
        // Update user analytics
        break
      case 'message_created':
        // Update message analytics
        break
      case 'message_viewed':
        // Update view analytics
        break
      default:
        throw new Error('Invalid analytics type')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Analytics updated successfully'
    })
  } catch (error) {
    console.error('Error updating analytics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update analytics'
    }, { status: 500 })
  }
}
