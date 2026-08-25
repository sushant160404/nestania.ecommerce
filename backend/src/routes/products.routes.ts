import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller';

const router = Router();

// Public routes
router.get('/products', listProducts);
router.get('/products/:id', getProduct);

// Admin routes (in a real app, these would be protected with auth middleware)
router.post('/admin/products', createProduct);
router.put('/admin/products/:id', updateProduct);
router.delete('/admin/products/:id', deleteProduct);

export default router;
