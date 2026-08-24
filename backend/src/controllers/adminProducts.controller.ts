import { Request, Response } from 'express';
import { Product } from '../models/types';
import { PRODUCTS } from '../models/productData';
import { autoRegisterImages } from '../utils/adminImageUtils';

export function listAdminProducts(_req: Request, res: Response) {
  res.json(PRODUCTS);
}

export function getAdminProduct(req: Request, res: Response) {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
}

export function createProduct(req: Request, res: Response) {
  const product: Product = req.body;
  if (!product.name || !product.price || !product.category) {
    return res.status(400).json({ error: 'name, price and category are required' });
  }
  if (!product.id) {
    product.id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  if (PRODUCTS.find(p => p.id === product.id)) {
    return res.status(409).json({ error: 'Product with this ID already exists' });
  }

  autoRegisterImages(product.id, product.image, product.galleryImages);

  PRODUCTS.push(product);
  res.status(201).json(product);
}

export function updateProduct(req: Request, res: Response) {
  const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  const updatedProduct = { ...PRODUCTS[idx], ...req.body, id: req.params.id };

  autoRegisterImages(updatedProduct.id, updatedProduct.image, updatedProduct.galleryImages);

  PRODUCTS[idx] = updatedProduct;
  res.json(PRODUCTS[idx]);
}

export function deleteProduct(req: Request, res: Response) {
  const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  PRODUCTS.splice(idx, 1);
  res.json({ success: true });
}
