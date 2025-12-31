import { NextRequest, NextResponse } from 'next/server'
import { getReportsWithFilters } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const priority = url.searchParams.get('priority')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const keyword = url.searchParams.get('keyword')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    const filters = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(keyword && { keyword })
    }
    
    const result = await getReportsWithFilters(filters, { page, limit })
    
    return NextResponse.json({
      success: true,
      reports: result.reports,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    })

  } catch (error) {
    console.error('Admin reports fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reports'
    }, { status: 500 })
  }
}