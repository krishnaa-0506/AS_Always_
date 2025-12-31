import crypto from 'crypto';
import { DatabaseService } from '@/lib/db/mongodb';

interface OTPData {
  email: string;
  otp: string;
  purpose: 'signup' | 'login' | 'message_created' | 'message_viewed' | 'payment_verification';
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}

class OTPService {
  private dbService = new DatabaseService();
  private readonly OTP_LENGTH = 6;
  private readonly MAX_ATTEMPTS = 5;
  private readonly EXPIRY_MINUTES = 5;

  /**
   * Generate a secure 6-digit OTP
   */
  private generateOTP(): string {
    return crypto.randomBytes(3).readUIntBE(0, 3).toString().padStart(6, '0').slice(0, 6);
  }

  /**
   * Create and store OTP for email verification
   */
  async createOTP(email: string, purpose: OTPData['purpose']): Promise<string> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000);

    try {
      const db = await this.dbService.connect();
      // Remove any existing OTPs for this email and purpose
      await db.collection('otps')
        .deleteMany({ email, purpose });

      // Store new OTP
      await db.collection('otps')
        .insertOne({
          email,
          otp: this.hashOTP(otp),
          purpose,
          expiresAt,
          verified: false,
          attempts: 0,
          createdAt: new Date()
        });

      return otp;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw new Error('Failed to generate OTP');
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string, purpose: OTPData['purpose']): Promise<boolean> {
    try {
      const db = await this.dbService.connect();
      const hashedOTP = this.hashOTP(otp);
      
      const otpRecord = await db.collection('otps')
        .findOne({
          email,
          purpose,
          verified: false,
          expiresAt: { $gt: new Date() }
        });

      if (!otpRecord) {
        throw new Error('OTP not found or expired');
      }

      // Check attempts limit
      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        await db.collection('otps')
          .deleteOne({ _id: otpRecord._id });
        throw new Error('Maximum attempts exceeded');
      }

      // Increment attempts
      await db.collection('otps')
        .updateOne(
          { _id: otpRecord._id },
          { $inc: { attempts: 1 } }
        );

      // Verify OTP
      if (otpRecord.otp === hashedOTP) {
        // Mark as verified and remove
        await db.collection('otps')
          .deleteOne({ _id: otpRecord._id });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Check if OTP exists and is valid
   */
  async isOTPValid(email: string, purpose: OTPData['purpose']): Promise<boolean> {
    try {
      const db = await this.dbService.connect();
      const otpRecord = await db.collection('otps')
        .findOne({
          email,
          purpose,
          verified: false,
          expiresAt: { $gt: new Date() },
          attempts: { $lt: this.MAX_ATTEMPTS }
        });

      return !!otpRecord;
    } catch (error) {
      console.error('Error checking OTP validity:', error);
      return false;
    }
  }

  /**
   * Hash OTP for secure storage
   */
  private hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp + process.env.OTP_SECRET).digest('hex');
  }

  /**
   * Clean expired OTPs (should be run periodically)
   */
  async cleanExpiredOTPs(): Promise<void> {
    try {
      const db = await this.dbService.connect();
      await db.collection('otps')
        .deleteMany({ expiresAt: { $lt: new Date() } });
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
    }
  }

  /**
   * Get remaining time for OTP
   */
  async getOTPRemainingTime(email: string, purpose: OTPData['purpose']): Promise<number> {
    try {
      const db = await this.dbService.connect();
      const otpRecord = await db.collection('otps')
        .findOne({
          email,
          purpose,
          verified: false,
          expiresAt: { $gt: new Date() }
        });

      if (!otpRecord) return 0;

      return Math.max(0, otpRecord.expiresAt.getTime() - Date.now());
    } catch (error) {
      console.error('Error getting OTP remaining time:', error);
      return 0;
    }
  }
}

export const otpService = new OTPService();
export default OTPService;