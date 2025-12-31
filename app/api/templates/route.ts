import { NextRequest, NextResponse } from 'next/server'
import { templates } from '@/lib/data/random-templates'

export async function GET() {
  try {
    // Return universal templates
    return NextResponse.json({
      success: true,
      templates: templates,
      count: templates.length
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch templates' 
      },
      { status: 500 }
    )
  }
}