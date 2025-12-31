import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { bulkUpdateReports } from '@/lib/db/mongodb'

export async function PATCH(req: NextRequest) {
  try {
    const { reportIds, status } = await req.json()

    if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report IDs required' },
        { status: 400 }
      )
    }

    if (!status || !['RESOLVED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status required' },
        { status: 400 }
      )
    }

    // Update all reports in bulk
    const result = await bulkUpdateReports(reportIds, status)

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} reports updated successfully`,
      updated: result.modifiedCount
    })

  } catch (error) {
    console.error('Bulk update reports error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update reports' },
      { status: 500 }
    )
  }
}