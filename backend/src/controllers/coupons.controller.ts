import { Request, Response } from 'express';
import { COUPONS } from '../models/productData';

export function verifyCoupon(req: Request, res: Response) {
  const { code, cartSubtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });

  const coupon = COUPONS.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim());
  if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid promo code. Try NEST10 or PREPAID10' });
  if (cartSubtotal < coupon.minOrder) {
    return res.status(400).json({ valid: false, message: `Minimum order of ₹${coupon.minOrder} required for code ${coupon.code}` });
  }

  let discountAmount = Math.round((cartSubtotal * coupon.discountPercent) / 100);
  if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;

  res.json({ valid: true, coupon, discountAmount, message: `Promo applied: ${coupon.discountPercent}% OFF! (Saved ₹${discountAmount})` });
}
