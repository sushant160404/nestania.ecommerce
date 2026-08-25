import { Request, Response } from 'express';
import { databaseService } from '../services/DatabaseService';

export async function listProducts(req: Request, res: Response) {
  try {
    const { category, search, sort, isNew, isSale, isBestSeller, minPrice, maxPrice } = req.query;

    // Get products from database with filters
    let result = await databaseService.getProductsByFilters({
      category: category as string,
      search: search as string,
      isNew: isNew === 'true',
      isSale: isSale === 'true', 
      isBestSeller: isBestSeller === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    });

    // Apply sorting
    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const product = await databaseService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const related = await databaseService.getProductsByCategory(product.category);
    const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 4);
    
    const reviews = await databaseService.getProductReviews(product.id);
    
    res.json({ product, related: relatedFiltered, reviews });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

// Admin endpoints for product management
export async function createProduct(req: Request, res: Response) {
  try {
    const product = await databaseService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const product = await databaseService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const success = await databaseService.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
