import { Request, Response } from 'express';

export function checkPincode(req: Request, res: Response) {
  const { pincode } = req.body;
  if (!pincode || String(pincode).length !== 6) {
    return res.status(400).json({ valid: false, message: 'Please enter a valid 6-digit PIN code' });
  }
  const isMetro = ['110001', '400001', '560001', '600001', '700001', '500001'].includes(pincode)
    || pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56');

  res.json({
    valid: true,
    serviceable: true,
    estimatedDays: isMetro ? '1-2 Days (Express)' : '2-4 Days (Standard)',
    freeDeliveryEligible: true,
    cashOnDeliveryAvailable: true,
    message: isMetro
      ? 'Fast Delivery available in your area! Order today for delivery by tomorrow.'
      : 'Standard courier delivery available with safe fragile packaging.',
  });
}
