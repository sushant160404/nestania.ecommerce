import { Request, Response } from 'express';
import { Review } from '../models/types';
import { PRODUCTS } from '../models/productData';
import { databaseService } from '../services/DatabaseService';

export async function createReview(req: Request, res: Response) {
  const { productId, author, rating, title, comment } = req.body;
  if (!productId || !author || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const newRev: Omit<Review, 'id'> = {
    productId,
    author,
    rating: Number(rating),
    date: new Date().toISOString().split('T')[0],
    title: title || 'Thoughtfully crafted product',
    comment,
    verifiedPurchase: true,
    helpfulCount: 1,
  };

  const createdReview = await databaseService.createReview(newRev);

  // Update in-memory product rating
  const prod = PRODUCTS.find(p => p.id === productId);
  if (prod) {
    prod.reviewsCount += 1;
    prod.rating = Number(((prod.rating * (prod.reviewsCount - 1) + Number(rating)) / prod.reviewsCount).toFixed(1));
  }

  res.status(201).json(createdReview);
}
