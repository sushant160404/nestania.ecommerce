import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function getDashboardStats(_req: Request, res: Response) {
  try {
    const orders = await databaseService.getAllOrders();
    const contacts = await databaseService.getAllContactMessages();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map(o => o.shippingAddress?.email).filter(Boolean)).size;
    const pendingOrders = orders.filter(o =>
      o.status === 'confirmed' || o.status === 'processing'
    ).length;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentOrders = orders.filter(o => new Date(o.date) >= thirtyDaysAgo);
    const previousOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
    });

    const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
    const previousRevenue = previousOrders.reduce((sum, o) => sum + o.total, 0);

    const revenueChange = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const ordersChange = previousOrders.length > 0
      ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
      : 0;

    res.json({
      totalRevenue,
      revenueChange: Math.round(revenueChange * 10) / 10,
      totalOrders,
      ordersChange: Math.round(ordersChange * 10) / 10,
      totalCustomers,
      customersChange: 5.4, // Keep as placeholder for now
      pendingOrders,
      pendingChange: -3.1,  // Keep as placeholder for now
      recentOrders: orders.slice(0, 5),
      unreadMessages: contacts.filter(c => c.status === 'unread').length,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}
