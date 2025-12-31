import { NextResponse } from 'next/server'
import { fallbackAuth } from '@/lib/auth/fallback'

export async function GET() {
  try {
    const testUser = await fallbackAuth.findByEmail('harihk0506@gmail.com')
    return NextResponse.json({
      success: true,
      userExists: !!testUser,
      testUser: testUser ? {
        email: testUser.email,
        name: testUser.name,
        role: testUser.role
      } : null
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}