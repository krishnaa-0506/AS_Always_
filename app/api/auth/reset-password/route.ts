import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/db/mongodb'
import { authService } from '@/lib/auth/jwt'
import { emailService } from '@/lib/email/emailService'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    const user = await dbService.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If email exists, reset link will be sent'
      })
    }

    const resetToken = authService.generateResetToken(email)
    
    // Send reset email
    const emailSent = await emailService.sendPasswordReset(email, resetToken)
    
    if (!emailSent) {
      console.error('Failed to send password reset email to:', email)
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a reset link has been sent'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({
      success: false,
      error: 'Password reset failed'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({
        success: false,
        error: 'Token and new password are required'
      }, { status: 400 })
    }

    const payload = authService.verifyResetToken(token)
    if (!payload) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 400 })
    }

    const hashedPassword = await authService.hashPassword(newPassword)
    await dbService.updateUserPassword(payload.email, hashedPassword)

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })

  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Password update failed'
    }, { status: 500 })
  }
}