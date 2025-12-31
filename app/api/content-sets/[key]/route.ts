import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params
    
    // Validate key format for security
    if (!key || !/^[a-zA-Z0-9_]+$/.test(key)) {
      return NextResponse.json(
        { error: 'Invalid content set key' },
        { status: 400 }
      )
    }

    const contentSetsPath = path.join(process.cwd(), 'content-sets')
    const filePath = path.join(contentSetsPath, `${key}.js`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Content set ${key} not found` },
        { status: 404 }
      )
    }

    // Read and evaluate the JS file
    const fileContent = fs.readFileSync(filePath, 'utf8')

    // Try to extract named export first
    let contentSetString: string | null = null
    const namedMatch = fileContent.match(/export const \w+ = (\{[\s\S]*\});/)
    if (namedMatch && namedMatch[1]) {
      contentSetString = namedMatch[1]
    }

    // Fallback: support default export format `export default { ... }`
    if (!contentSetString) {
      const defaultMatch = fileContent.match(/export default\s+(\{[\s\S]*\});?/)
      if (defaultMatch && defaultMatch[1]) {
        contentSetString = defaultMatch[1]
      }
    }

    if (!contentSetString) {
      return NextResponse.json(
        { error: `Invalid content set format in ${key}` },
        { status: 500 }
      )
    }

    // Parse the content (this is safe since it's our own generated content)
    const contentSet = eval(`(${contentSetString})`)

    return NextResponse.json(contentSet)

  } catch (error) {
    console.error(`Error loading content set ${params?.key}:`, error)
    return NextResponse.json(
      { error: 'Failed to load content set' },
      { status: 500 }
    )
  }
}