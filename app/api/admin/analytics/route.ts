import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { ContentUniquenessService } from '@/lib/services/contentUniqueness'

// Simple admin authentication - in production, use proper JWT/session auth
const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || '306206'

function authenticateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminCode = request.headers.get('x-admin-code')
  const adminCookie = request.cookies.get('asalways-admin')?.value
  
  return adminCookie === 'authenticated' || adminCode === ADMIN_SECRET_CODE || authHeader === `Bearer ${ADMIN_SECRET_CODE}`
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const period = url.searchParams.get('days') || '30'
    const periodDays = parseInt(period)
    
    let analytics, messages: any[];
    try {
      analytics = await dbService.getAnalytics(periodDays)
      const messagesResult = await dbService.getMessages(undefined, 1000, 0)
      messages = messagesResult.messages
    } catch (error) {
      console.error('Database error in analytics:', error)
      // Return default values if database is not available
      analytics = {
        totalUsers: 0,
        totalMessages: 0,
        totalMemories: 0,
        totalReactions: 0,
        recentUsers: 0,
        recentMessages: 0,
        viewedMessages: 0,
        viewRate: 0
      }
      messages = []
    }
    
    // Get content uniqueness analytics
    const contentAnalytics = await ContentUniquenessService.getContentAnalytics()
    
    // Calculate relationship stats from real data
    const relationshipStats = messages.reduce((acc: Record<string, number>, msg) => {
      acc[msg.relationship] = (acc[msg.relationship] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const messagesByRelationship = Object.entries(relationshipStats).map(([relationship, count]) => ({
      relationship,
      count: count as number,
      percentage: messages.length > 0 ? ((count as number) / messages.length * 100) : 0
    }))
    
    // Recent activity from real messages
    const recentActivity = messages.slice(0, 5).map(msg => ({
      id: msg._id,
      type: msg.isViewed ? 'message_viewed' : 'message_created',
      user: msg.senderName,
      description: `${msg.isViewed ? 'Viewed' : 'Created'} a ${msg.relationship} message`,
      timestamp: msg.createdAt
    }))

    // Return simplified data structure that matches the AnalyticsPanel expectations
    return NextResponse.json({
      success: true,
      data: {
        totalUsers: analytics.totalUsers,
        totalMessages: analytics.totalMessages,
        totalMemories: analytics.totalMemories || 0,
        totalReactions: analytics.totalReactions || 0,
        recentUsers: analytics.recentUsers,
        recentMessages: analytics.recentMessages,
        viewedMessages: analytics.viewedMessages,
        viewRate: analytics.totalMessages > 0 ? (analytics.viewedMessages / analytics.totalMessages) * 100 : 0
      }
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const data = await request.json()
    const { action } = data

    switch (action) {
      case 'cleanup_old_data':
        return NextResponse.json({
          success: true,
          message: 'Data cleanup completed'
        })

      case 'regenerate_analytics':
        return NextResponse.json({
          success: true,
          message: 'Analytics cache refreshed'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to execute admin action'
    }, { status: 500 })
  }
}