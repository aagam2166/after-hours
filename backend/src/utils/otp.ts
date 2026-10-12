import { env } from '../config/env';

/**
 * Generate a 4-digit OTP.
 * In mock mode (prototype), always returns the configured mock code.
 */
export function generateOtp(): string {
  if (env.OTP_MOCK_MODE) return env.OTP_MOCK_CODE;
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * "Send" OTP via SMS.
 * In prototype mode, just logs it — swap with Twilio / MSG91 in production.
 */
export async function sendOtp(mobile: string, code: string): Promise<void> {
  if (env.OTP_MOCK_MODE) {
    console.log(`[OTP MOCK] Mobile: ${mobile} → Code: ${code}`);
    return;
  }
  // TODO: integrate real SMS provider (MSG91 / Twilio)
  throw new Error('Real SMS provider not configured');
}
