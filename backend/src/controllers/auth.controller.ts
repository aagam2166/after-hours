import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';

export const authController = {
  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile } = req.body;
      const result = await authService.sendOtp(mobile);
      res.status(200).json(new ApiResponse(200, result, result.message));
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, code } = req.body;
      const result = await authService.verifyOtp(mobile, code);
      res.status(200).json(new ApiResponse(200, result, 'OTP verified successfully'));
    } catch (err) {
      next(err);
    }
  },
};
