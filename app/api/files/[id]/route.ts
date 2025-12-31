// PERMANENTLY DISABLED: GridFS file serving has been completely removed from this project
// All files are now served directly from Cloudinary CDN

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    error: 'GridFS file system permanently disabled. All files served from Cloudinary CDN.',
    message: 'This endpoint has been permanently disabled. Files are served directly from Cloudinary.'
  }, { status: 410 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: false,
    error: 'GridFS file deletion permanently disabled. Use Cloudinary API for file management.',
    message: 'This endpoint has been permanently disabled. Use /api/upload DELETE for Cloudinary files.'
  }, { status: 410 })
}