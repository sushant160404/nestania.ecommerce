import { Router } from 'express';
import { getWishlist, saveWishlist } from '../controllers/wishlist.controller';

const router = Router();
router.get('/wishlist/:userId', getWishlist);
router.put('/wishlist/:userId', saveWishlist);

export default router;
