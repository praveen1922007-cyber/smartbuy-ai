import { Request, Response } from 'express';
import * as ProductService from '../services/product.service';

export async function createProduct(req: Request, res: Response) {
  try {
    const payload = req.body;
    const p = await ProductService.createProduct(payload);
    res.status(201).json(p);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not create product' });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const p = await ProductService.getProduct(id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not fetch product' });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const changes = req.body;
    const p = await ProductService.updateProduct(id, changes);
    res.json(p);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not update product' });
  }
}

export async function searchProducts(req: Request, res: Response) {
  try {
    const q = String(req.query.q || '');
    const limit = Number(req.query.limit || 30);
    const results = await ProductService.searchProducts(q, limit);
    res.json(results);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Search failed' });
  }
}

export async function productsByStore(req: Request, res: Response) {
  try {
    const { storeId } = req.params;
    const list = await ProductService.productsByStore(storeId);
    res.json(list);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to fetch products' });
  }
}

export async function compare(req: Request, res: Response) {
  try {
    const { name, barcode } = req.query;
    const comp = await (await import('./product.compare.controller')).compareProducts(req, res);
    return comp;
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Compare failed' });
  }
}
