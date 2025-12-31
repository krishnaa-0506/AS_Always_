import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || '306206'

function authenticateAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminCode = request.headers.get('x-admin-code')
  const adminCookie = request.cookies.get('asalways-admin')?.value
  
  return adminCookie === 'authenticated' || adminCode === ADMIN_SECRET_CODE || authHeader === `Bearer ${ADMIN_SECRET_CODE}`
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required'
      }, { status: 401 })
    }

    const url = new URL(request.url)
    const filename = url.searchParams.get('file')
    const type = url.searchParams.get('type') || 'export'

    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'Filename required'
      }, { status: 400 })
    }

    // For demo purposes, return a download trigger response
    // In production, you would generate and serve the actual file
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return NextResponse.json({
      success: true,
      message: `${type} file ready for download`,
      filename,
      downloadReady: true
    }, { headers })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to prepare download'
    }, { status: 500 })
  }
}