import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function getWishlist(req: Request, res: Response) {
  try {
    const products = await databaseService.getWishlist(req.params.userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
}

export async function saveWishlist(req: Request, res: Response) {
  const { products } = req.body;
  if (!Array.isArray(products)) return res.status(400).json({ error: 'products array required' });
  try {
    await databaseService.saveWishlist(req.params.userId, products);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save wishlist' });
  }
}
