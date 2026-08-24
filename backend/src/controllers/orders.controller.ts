import { Request, Response } from 'express';
import { Order } from '../models/types';
import { databaseService } from '../services/DatabaseService';

export async function createOrder(req: Request, res: Response) {
  const { items, shippingAddress, paymentMethod, subtotal, discount, shipping, total, couponCode } = req.body;
  if (!items?.length || !shippingAddress) return res.status(400).json({ error: 'Incomplete order payload' });

  const now = new Date();
  const estDeliveryDate = new Date();
  estDeliveryDate.setDate(now.getDate() + 3);

  const newOrder: Omit<Order, 'id'> = {
    orderNumber: `NST-2025-${Math.floor(10000 + Math.random() * 90000)}`,
    date: now.toISOString().split('T')[0],
    status: 'confirmed',
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    subtotal,
    discount: discount || 0,
    shipping: shipping || 0,
    total,
    couponCode,
    estimatedDelivery: estDeliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    trackingSteps: [
      { status: 'ordered',          title: 'Order Received',              description: 'Payment verified & artisan inventory reserved',               timestamp: 'Just now',                completed: true  },
      { status: 'confirmed',        title: 'Processing in Studio',        description: 'Ceramics inspected & packaged in reinforced bubble cushions',  timestamp: 'Expected within 12 hours', completed: true  },
      { status: 'shipped',          title: 'Dispatched via Premium Express', description: 'Fragile handling priority tracking',                        timestamp: 'Expected tomorrow',        completed: false },
      { status: 'out_for_delivery', title: 'Out for Delivery',            description: `Courier will deliver to ${shippingAddress.city}`,              timestamp: 'Expected in 2-3 days',     completed: false },
      { status: 'delivered',        title: 'Delivered',                   description: 'Safe arrival at your doorstep',                                timestamp: 'Pending delivery',         completed: false },
    ],
  };

  const createdOrder = await databaseService.createOrder(newOrder);
  res.status(201).json(createdOrder);
}

export async function listOrders(_req: Request, res: Response) {
  const orders = await databaseService.getAllOrders();
  res.json(orders);
}

export async function getOrderByNumber(req: Request, res: Response) {
  const order = await databaseService.getOrderByNumber(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });

  try {
    const updatedOrder = await databaseService.updateOrderStatus(req.params.id, status);
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    res.json(updatedOrder);
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}
