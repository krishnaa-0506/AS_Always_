import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    
    let templates = await dbService.getTemplates(category || undefined)
    
    return NextResponse.json({
      success: true,
      templates
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch templates'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()
    
    // Add default fields if not provided
    const template = await dbService.createTemplate({
      ...templateData,
      isActive: templateData.isActive ?? true,
      createdAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      template
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create template'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { templateId, ...updateData } = await request.json()
    
    if (!templateId) {
      return NextResponse.json({
        success: false,
        error: 'Template ID is required'
      }, { status: 400 })
    }
    
    const template = await dbService.updateTemplate(templateId, updateData)
    
    if (!template) {
      return NextResponse.json({
        success: false,
        error: 'Template not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      template
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update template'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const templateId = url.searchParams.get('id')
    
    if (!templateId) {
      return NextResponse.json({
        success: false,
        error: 'Template ID is required'
      }, { status: 400 })
    }
    
    await dbService.deleteTemplate(templateId)
    
    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete template'
    }, { status: 500 })
  }
}
