import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add admin authentication check
    
    const { status, adminNote } = await request.json()
    
    if (!status) {
      return NextResponse.json({
        success: false,
        error: 'Status is required'
      }, { status: 400 })
    }

    const validStatuses = ['PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status'
      }, { status: 400 })
    }
    
    await dbService.updateReportStatus(params.id, status, adminNote)
    
    return NextResponse.json({
      success: true,
      message: 'Report updated successfully'
    })

  } catch (error) {
    console.error('Admin report update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update report'
    }, { status: 500 })
  }
}