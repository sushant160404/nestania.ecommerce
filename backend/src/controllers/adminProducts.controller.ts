import { Request, Response } from 'express';
import { Product } from '../models/types';
import { PRODUCTS } from '../models/productData';
import { autoRegisterImages } from '../utils/adminImageUtils';
import { databaseService } from '../services/DatabaseService';

export async function listAdminProducts(_req: Request, res: Response) {
  try {
    // Try to get products from database first, fallback to in-memory
    const dbProducts = await databaseService.getAllProducts();
    if (dbProducts.length > 0) {
      return res.json(dbProducts);
    }
  } catch (error) {
    console.log('Database unavailable, using in-memory products');
  }
  res.json(PRODUCTS);
}

export async function getAdminProduct(req: Request, res: Response) {
  try {
    // Try database first
    const dbProduct = await databaseService.getProductById(req.params.id);
    if (dbProduct) {
      return res.json(dbProduct);
    }
  } catch (error) {
    console.log('Database unavailable, using in-memory products');
  }
  
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const product: Product = req.body;
  if (!product.name || !product.price || !product.category) {
    return res.status(400).json({ error: 'name, price and category are required' });
  }
  if (!product.id) {
    product.id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  autoRegisterImages(product.id, product.image, product.galleryImages);

  try {
    // Try to save to database
    const newProduct = await databaseService.createProduct(product);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.log('Database unavailable, using in-memory storage');
    
    // Fallback to in-memory
    if (PRODUCTS.find(p => p.id === product.id)) {
      return res.status(409).json({ error: 'Product with this ID already exists' });
    }
    PRODUCTS.push(product);
    return res.status(201).json(product);
  }
}

export async function updateProduct(req: Request, res: Response) {
  const updatedData = { ...req.body, id: req.params.id };

  autoRegisterImages(updatedData.id, updatedData.image, updatedData.galleryImages);

  try {
    // Try to update in database
    const updatedProduct = await databaseService.updateProduct(req.params.id, updatedData);
    if (updatedProduct) {
      return res.json(updatedProduct);
    }
  } catch (error) {
    console.log('Database unavailable, using in-memory storage');
  }

  // Fallback to in-memory
  const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  PRODUCTS[idx] = { ...PRODUCTS[idx], ...updatedData };
  res.json(PRODUCTS[idx]);
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    // Try to delete from database
    const deleted = await databaseService.deleteProduct(req.params.id);
    if (deleted) {
      return res.json({ success: true });
    }
  } catch (error) {
    console.log('Database unavailable, using in-memory storage');
  }

  // Fallback to in-memory
  const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  PRODUCTS.splice(idx, 1);
  res.json({ success: true });
}
