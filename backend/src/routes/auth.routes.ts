import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const sendOtpSchema = z.object({
  mobile: z.string().regex(/^\+?[0-9]{10,13}$/, 'Invalid mobile number'),
});

const verifyOtpSchema = z.object({
  mobile: z.string().regex(/^\+?[0-9]{10,13}$/, 'Invalid mobile number'),
  code: z.string().length(4, 'OTP must be 4 digits'),
});

router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);

export default router;
