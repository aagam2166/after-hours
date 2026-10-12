import { Router } from 'express';
import { serviceAreaController } from '../controllers/serviceArea.controller';

const router = Router();

// GET /api/v1/service-areas/check?pincode=400001
router.get('/check', serviceAreaController.check);

export default router;
