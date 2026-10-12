import { Router } from 'express';
import { z } from 'zod';
import { bookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

const updateDraftSchema = z.object({
  occasion: z.string().optional(),
  guestCount: z.number().int().positive().optional(),
  selectedServices: z.array(z.string()).optional(),
  spaceSize: z.string().optional(),
  packageId: z.string().uuid().optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  address: z.string().optional(),
  flatNumber: z.string().optional(),
  building: z.string().optional(),
  landmark: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accessInstructions: z.string().optional(),
  foodPackingNotes: z.string().optional(),
  pets: z.string().optional(),
  doNotTouchItems: z.array(z.string()).optional(),
  otherNotes: z.string().optional(),
});

const recommendSchema = z.object({
  selectedServices: z.array(z.string()).min(1),
  guestCount: z.number().int().positive(),
  spaceSize: z.string(),
});

const rateSchema = z.object({
  score: z.number().int().min(1).max(5),
  label: z.enum(['Not great', 'Okay', 'Good', 'Great', 'Amazing']),
  feedback: z.string().max(500).optional(),
});

const statusSchema = z.object({
  status: z.string(),
});

router.use(authMiddleware);

router.post('/', bookingController.create);
router.get('/', bookingController.getAll);
router.get('/availability', bookingController.checkAvailability);
router.post('/recommend', validate(recommendSchema), bookingController.recommend);
router.get('/:id', bookingController.getById);
router.patch('/:id', validate(updateDraftSchema), bookingController.update);
router.post('/:id/hold', bookingController.holdSlot);
router.post('/:id/confirm', bookingController.confirm);
router.patch('/:id/status', validate(statusSchema), bookingController.updateStatus);
router.post('/:id/rate', validate(rateSchema), bookingController.rate);

export default router;
