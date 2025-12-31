import { NextRequest, NextResponse } from 'next/server'
import { otpService } from '@/lib/email/otpService'
import { emailService } from '@/lib/email/emailService'

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json()

    if (!email || !purpose) {
      return NextResponse.json(
        { success: false, error: 'Email and purpose are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate purpose
    const validPurposes = ['signup', 'login', 'message_created', 'message_viewed', 'payment_verification']
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json(
        { success: false, error: 'Invalid purpose' },
        { status: 400 }
      )
    }

    // Check if valid OTP already exists
    const isValid = await otpService.isOTPValid(email, purpose)
    if (isValid) {
      const remainingTime = await otpService.getOTPRemainingTime(email, purpose)
      return NextResponse.json(
        { 
          success: false, 
          error: 'OTP already sent', 
          remainingTime: Math.ceil(remainingTime / 1000) 
        },
        { status: 429 }
      )
    }

    // Generate and send OTP
    const otp = await otpService.createOTP(email, purpose)
    const emailSent = await emailService.sendOTPEmail(email, otp, purpose)

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 300 // 5 minutes in seconds
    })

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}