import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { reason } = await request.json()
    
    if (!reason || !reason.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Report reason is required'
      }, { status: 400 })
    }

    // Get message being reported
    const message = await dbService.getMessageByCode(params.code)
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Message not found'
      }, { status: 404 })
    }

    // Create report record
    const report = {
      messageId: message._id,
      messageCode: params.code,
      reason: reason.trim(),
      reportedBy: {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      },
      messageDetails: {
        senderName: message.senderName,
        receiverName: message.receiverName,
        relationship: message.relationship,
        emotionTag: message.emotionTag,
        hasMemories: message.memories?.length > 0,
        hasVoice: !!message.voiceNote,
        createdAt: message.createdAt
      },
      status: 'PENDING',
      timestamp: new Date(),
      priority: getPriority(reason)
    }

    // Save report to database
    const savedReport = await dbService.addContentReport(report)
    
    // TODO: Send alert to admin for high-priority reports
    if (report.priority === 'HIGH') {
      // Send immediate notification to admin
    }
    
    return NextResponse.json({
      success: true,
      reportId: savedReport.insertedId,
      message: 'Report submitted successfully'
    })

  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to submit report'
    }, { status: 500 })
  }
}

function getPriority(reason: string): 'HIGH' | 'MEDIUM' | 'LOW' {
  const highPriorityKeywords = ['harassment', 'abuse', 'threat', 'inappropriate']
  const mediumPriorityKeywords = ['spam', 'fake', 'copyright']
  
  const lowerReason = reason.toLowerCase()
  
  if (highPriorityKeywords.some(keyword => lowerReason.includes(keyword))) {
    return 'HIGH'
  } else if (mediumPriorityKeywords.some(keyword => lowerReason.includes(keyword))) {
    return 'MEDIUM'
  } else {
    return 'LOW'
  }
}