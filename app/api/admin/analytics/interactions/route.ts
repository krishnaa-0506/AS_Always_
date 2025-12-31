import { NextRequest, NextResponse } from 'next/server'
import { getInteractionAnalytics } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    
    const url = new URL(request.url)
    const timeRange = url.searchParams.get('timeRange') || '7days'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '24hours':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7days':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30days':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90days':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get interaction analytics
    const analytics = await getInteractionAnalytics(startDate, endDate)
    
    return NextResponse.json({
      success: true,
      analytics,
      timeRange,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics'
    }, { status: 500 })
  }
}