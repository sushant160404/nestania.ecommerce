import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function subscribe(req: Request, res: Response) {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email address required' });

  const isSubscribed = await databaseService.isEmailSubscribed(email);
  if (isSubscribed) {
    return res.json({ success: true, message: 'You are already subscribed! Use coupon NEST10 for 10% off.', code: 'NEST10' });
  }

  await databaseService.addNewsletterSubscriber(email);
  res.json({ success: true, message: 'Welcome to the Nestania Family! Use coupon NEST10 for 10% off your first order.', code: 'NEST10' });
}
