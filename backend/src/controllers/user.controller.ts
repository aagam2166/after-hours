import { Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../types';

export const userController = {
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.id);
      res.status(200).json(new ApiResponse(200, user));
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.id, req.body);
      res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
    } catch (err) {
      next(err);
    }
  },
};
