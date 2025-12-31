import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { defaultTemplates } from '@/lib/data/templates'
import { defaultThemes } from '@/lib/data/themes'

export async function POST(request: NextRequest) {
  try {
    // Seed templates
    for (const template of defaultTemplates) {
      try {
        await dbService.createTemplate(template)
      } catch (error) {
        console.error(`Failed to create template: ${template.name}`, error)
      }
    }

    // Seed themes
    for (const theme of defaultThemes) {
      try {
        await dbService.createTheme(theme)
      } catch (error) {
        console.error(`Failed to create theme: ${theme.name}`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${defaultTemplates.length} templates and ${defaultThemes.length} themes`
    })
  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to seed data'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await dbService.connect()
    
    // Clear existing templates and themes
    await Promise.all([
      db.collection('templates').deleteMany({}),
      db.collection('themes').deleteMany({})
    ])

    return NextResponse.json({
      success: true,
      message: 'Successfully cleared all templates and themes'
    })
  } catch (error) {
    console.error('Error clearing data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to clear data'
    }, { status: 500 })
  }
}
