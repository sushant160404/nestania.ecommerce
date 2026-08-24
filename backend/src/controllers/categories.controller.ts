import { Request, Response } from 'express';
import { CATEGORIES } from '../models/productData';

export function listCategories(_req: Request, res: Response) {
  res.json(CATEGORIES);
}
