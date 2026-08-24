import { Router } from 'express';
import { checkPincode } from '../controllers/pincode.controller';

const router = Router();
router.post('/pincode/check', checkPincode);

export default router;
