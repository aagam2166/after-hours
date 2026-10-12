import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import bookingRoutes from './booking.routes';
import packageRoutes from './package.routes';
import serviceAreaRoutes from './serviceArea.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/packages', packageRoutes);
router.use('/service-areas', serviceAreaRoutes);

export default router;
