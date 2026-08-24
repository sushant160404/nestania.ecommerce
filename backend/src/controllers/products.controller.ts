import { Request, Response } from 'express';
import { PRODUCTS } from '../models/productData';
import { databaseService } from '../services/DatabaseService';

export function listProducts(req: Request, res: Response) {
  let result = [...PRODUCTS];
  const { category, search, sort, isNew, isSale, isBestSeller, minPrice, maxPrice } = req.query;

  if (category && category !== 'All' && category !== 'Collections') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase().trim();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (isNew === 'true')        result = result.filter(p => p.isNew);
  if (isSale === 'true')       result = result.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
  if (isBestSeller === 'true') result = result.filter(p => p.isBestSeller);
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

  if (sort === 'price-low')  result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'newest')     result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  res.json(result);
}

export async function getProduct(req: Request, res: Response) {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const reviews = await databaseService.getProductReviews(product.id);
  res.json({ product, related, reviews });
}
