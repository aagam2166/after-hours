import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { generateOtp, sendOtp } from '../utils/otp';
import { userRepository } from '../repositories/user.repository';
import { otpRepository } from '../repositories/otp.repository';

const OTP_EXPIRY_MINUTES = 10;

export const authService = {
  async sendOtp(mobile: string): Promise<{ message: string; mockCode?: string }> {
    // Ensure user exists first for OtpCode foreign key relation
    await userRepository.upsertByMobile(mobile);

    // Clean expired OTPs for this mobile
    await otpRepository.deleteExpiredForMobile(mobile);

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await otpRepository.create(mobile, code, expiresAt);
    await sendOtp(mobile, code);

    const result: { message: string; mockCode?: string } = {
      message: `OTP sent to ${mobile}`,
    };

    // Expose mock code in dev so frontend can auto-fill
    if (env.OTP_MOCK_MODE && env.NODE_ENV === 'development') {
      result.mockCode = code;
    }

    return result;
  },

  async verifyOtp(mobile: string, code: string): Promise<{ token: string; isNewUser: boolean }> {
    const otpRecord = await otpRepository.findValid(mobile, code);

    if (!otpRecord) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    await otpRepository.markUsed(otpRecord.id);

    // Upsert user — create if first time
    const isExistingUser = !!(await userRepository.findByMobile(mobile));
    const user = await userRepository.upsertByMobile(mobile);

    // Mark mobile as verified
    await userRepository.update(user.id, { verified: true });

    const token = jwt.sign(
      { id: user.id, mobile: user.mobile },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return { token, isNewUser: !isExistingUser };
  },
};
