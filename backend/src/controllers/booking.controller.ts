import { Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { availabilityService, AVAILABLE_SLOTS } from '../services/availability.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { AuthenticatedRequest } from '../types';

export const bookingController = {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.createDraft(req.user!.id);
      res.status(201).json(new ApiResponse(201, booking, 'Booking draft created'));
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await bookingService.getUserBookings(req.user!.id);
      res.status(200).json(new ApiResponse(200, bookings));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const booking = await bookingService.getById(id, req.user!.id);
      res.status(200).json(new ApiResponse(200, booking));
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const booking = await bookingService.updateDraft(id, req.user!.id, req.body);
      res.status(200).json(new ApiResponse(200, booking, 'Booking updated'));
    } catch (err) {
      next(err);
    }
  },

  async recommend(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { selectedServices, guestCount, spaceSize } = req.body;
      if (!selectedServices || !guestCount || !spaceSize) {
        throw new ApiError(400, 'selectedServices, guestCount, and spaceSize are required');
      }
      const result = await bookingService.recommendPackage({ selectedServices, guestCount, spaceSize });
      res.status(200).json(new ApiResponse(200, result));
    } catch (err) {
      next(err);
    }
  },

  async checkAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;
      if (!date) throw new ApiError(400, 'date query param required (YYYY-MM-DD)');

      const checkDate = new Date(date as string);
      const slotsWithAvailability = await Promise.all(
        AVAILABLE_SLOTS.map(async (time) => {
          const result = await availabilityService.checkSlot(checkDate, time);
          return { time, available: result.available };
        })
      );

      res.status(200).json(new ApiResponse(200, { date, slots: slotsWithAvailability }));
    } catch (err) {
      next(err);
    }
  },

  async holdSlot(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const booking = await bookingService.checkAndHoldSlot(id, req.user!.id);
      res.status(200).json(new ApiResponse(200, booking, 'Slot held for 10 minutes'));
    } catch (err) {
      next(err);
    }
  },

  async confirm(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const booking = await bookingService.confirmBooking(id, req.user!.id);
      res.status(200).json(new ApiResponse(200, booking, 'Booking confirmed!'));
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const { status } = req.body;
      if (!status) throw new ApiError(400, 'status is required');
      const booking = await bookingService.updateStatus(id, req.user!.id, status);
      res.status(200).json(new ApiResponse(200, booking, 'Status updated'));
    } catch (err) {
      next(err);
    }
  },

  async rate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params['id'] as string;
      const { score, label, feedback } = req.body;
      if (!score || !label) throw new ApiError(400, 'score and label are required');
      const rating = await bookingService.submitRating(
        id,
        req.user!.id,
        score,
        label,
        feedback
      );
      res.status(201).json(new ApiResponse(201, rating, 'Rating submitted'));
    } catch (err) {
      next(err);
    }
  },
};
