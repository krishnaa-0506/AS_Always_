import { NextRequest, NextResponse } from 'next/server'
import { otpService } from '@/lib/email/otpService'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, purpose } = await request.json()

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP, and purpose are required' },
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

    // Validate OTP format (6 digits)
    const otpRegex = /^\d{6}$/
    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Verify OTP
    const isValid = await otpService.verifyOTP(email, otp, purpose)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message === 'Maximum attempts exceeded') {
        return NextResponse.json(
          { success: false, error: 'Maximum verification attempts exceeded. Please request a new OTP.' },
          { status: 429 }
        )
      }
      if (error.message === 'OTP not found or expired') {
        return NextResponse.json(
          { success: false, error: 'OTP not found or expired. Please request a new OTP.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}