import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/products.controller';

const router = Router();
router.get('/products', listProducts);
router.get('/products/:id', getProduct);

export default router;
