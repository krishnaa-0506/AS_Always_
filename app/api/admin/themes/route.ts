import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    
    let themes = await dbService.getThemes(category || undefined)
    
    return NextResponse.json({
      success: true,
      themes
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch themes'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const themeData = await request.json()
    const theme = await dbService.createTheme(themeData)
    
    return NextResponse.json({
      success: true,
      theme
    })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create theme'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { themeId, ...updateData } = await request.json()
    
    if (!themeId) {
      return NextResponse.json({
        success: false,
        error: 'Theme ID is required'
      }, { status: 400 })
    }
    
    const theme = await dbService.updateTheme(themeId, updateData)
    
    if (!theme) {
      return NextResponse.json({
        success: false,
        error: 'Theme not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      theme
    })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update theme'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const themeId = url.searchParams.get('id')
    
    if (!themeId) {
      return NextResponse.json({
        success: false,
        error: 'Theme ID is required'
      }, { status: 400 })
    }
    
    await dbService.deleteTheme(themeId)
    
    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting theme:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete theme'
    }, { status: 500 })
  }
}
