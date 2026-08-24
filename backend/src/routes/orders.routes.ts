import { Router } from 'express';
import { createOrder, listOrders, getOrderByNumber } from '../controllers/orders.controller';

const router = Router();
router.post('/orders', createOrder);
router.get('/orders', listOrders);
router.get('/orders/:orderNumber', getOrderByNumber);

export default router;
