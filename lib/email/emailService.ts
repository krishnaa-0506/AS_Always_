import nodemailer from 'nodemailer'
import { otpService } from './otpService'

class EmailService {
  private transporter!: nodemailer.Transporter
  private isConfigured: boolean = false

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    
    if (!user || !pass) {
      console.warn('Email service not configured - SMTP credentials missing')
      return
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      }
    })
    this.isConfigured = true
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('Email would be sent:', { to, subject })
      return true
    }

    try {
      await this.transporter.sendMail({
        from: `"AsAlways" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
      })
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #e91e63; text-align: center; margin-bottom: 30px;">Welcome to AsAlways! 💝</h1>
          <p style="color: #666; font-size: 18px;">Hi ${name},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Welcome to AsAlways - where memories become magical experiences!</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">You can now create beautiful, AI-powered memory journeys for your loved ones.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/sender" style="background: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Start Creating Memories</a>
          </div>
          <p style="color: #999; text-align: center;">Best regards,<br>The AsAlways Team</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, 'Welcome to AsAlways! 🎉', html)
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset?token=${resetToken}`
    
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">🔐 Password Reset</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">You requested a password reset for your AsAlways account.</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, 'Reset Your AsAlways Password', html)
  }

  async sendMessageNotification(email: string, senderName: string, code: string): Promise<boolean> {
    const viewUrl = `${process.env.APP_URL || 'http://localhost:3000'}/receiver?code=${code}`
    
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #e91e63; text-align: center; margin-bottom: 30px;">You Have a Special Message! 💌</h1>
          <p style="color: #666; font-size: 18px; text-align: center;"><strong>${senderName}</strong> created a beautiful memory experience just for you!</p>
          <p style="color: #666; font-size: 16px; text-align: center;">Use this code to unlock your personalized journey:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 30px 0; border-radius: 10px;">
            <span style="color: #e91e63; font-size: 32px; font-weight: bold; letter-spacing: 4px;">${code}</span>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${viewUrl}" style="background: #e91e63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">View Your Message</a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">This is a one-time experience created with love by ${senderName}.</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, `${senderName} sent you a special message on AsAlways`, html)
  }

  async sendMessageViewedNotification(email: string, receiverName: string): Promise<boolean> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #ff6b6b; text-align: center; margin-bottom: 30px;">💕 Your memory was viewed!</h1>
          <p style="color: #666; font-size: 18px; text-align: center;"><strong>${receiverName}</strong> has experienced the beautiful memory you created.</p>
          <p style="color: #666; font-size: 16px; text-align: center;">Your heartfelt message has been delivered and cherished.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/sender/history" style="background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">View Message History</a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">Thank you for spreading love through AsAlways 🌟</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, `💕 ${receiverName} viewed your memory`, html)
  }

  async sendOTPEmail(email: string, otp: string, purpose: string): Promise<boolean> {
    const purposeText = {
      signup: 'account verification',
      login: 'secure login',
      message_created: 'message creation confirmation',
      message_viewed: 'message view notification',
      payment_verification: 'payment verification'
    }[purpose] || 'verification'

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">🔐 Verification Code</h1>
          <p style="color: #666; font-size: 16px; text-align: center;">Your ${purposeText} code for AsAlways:</p>
          <div style="background: #f8f9fa; padding: 30px; text-align: center; margin: 30px 0; border-radius: 15px; border: 2px dashed #667eea;">
            <span style="color: #667eea; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;">This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, `AsAlways - Your verification code: ${otp}`, html)
  }

  async sendPaymentConfirmationEmail(email: string, amount: number, plan: string): Promise<boolean> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; border-radius: 10px;">
        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color: #4facfe; text-align: center; margin-bottom: 30px;">💳 Payment Received!</h1>
          <p style="color: #666; font-size: 18px; text-align: center;">Thank you for your payment!</p>
          <div style="background: #f8f9fa; padding: 20px; margin: 30px 0; border-radius: 10px;">
            <p style="color: #666; font-size: 16px; margin: 10px 0;"><strong>Plan:</strong> ${plan}</p>
            <p style="color: #666; font-size: 16px; margin: 10px 0;"><strong>Amount:</strong> ₹${amount}</p>
            <p style="color: #666; font-size: 16px; margin: 10px 0;"><strong>Status:</strong> <span style="color: #28a745;">Confirmed</span></p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/sender" style="background: #4facfe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Start Creating Memories</a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">Your premium features are now active!</p>
        </div>
      </div>
    `
    return await this.sendEmail(email, `Payment Confirmation - ₹${amount}`, html)
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) return false
    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()