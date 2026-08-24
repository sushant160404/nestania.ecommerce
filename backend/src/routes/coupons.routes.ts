import { Router } from 'express';
import { verifyCoupon } from '../controllers/coupons.controller';

const router = Router();
router.post('/coupons/verify', verifyCoupon);

export default router;
