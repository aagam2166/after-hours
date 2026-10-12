import { Request, Response, NextFunction } from 'express';
import { serviceAreaService } from '../services/serviceArea.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export const serviceAreaController = {
  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const pincode = req.query.pincode as string;
      if (!pincode || !/^\d{6}$/.test(pincode)) {
        throw new ApiError(400, 'Provide a valid 6-digit pincode');
      }
      const result = await serviceAreaService.check(pincode);
      res.status(200).json(new ApiResponse(200, result));
    } catch (err) {
      next(err);
    }
  },
};
