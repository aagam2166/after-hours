import { Request, Response, NextFunction } from 'express';
import { packageRepository } from '../repositories/package.repository';
import { ApiResponse } from '../utils/ApiResponse';

export const packageController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const packages = await packageRepository.findAll();
      res.status(200).json(new ApiResponse(200, packages));
    } catch (err) {
      next(err);
    }
  },
};
