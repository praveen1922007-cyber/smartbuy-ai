import * as ProductRepo from '../repositories/product.repository';
import { IProduct } from '../models/product.model';

export async function createProduct(payload: Partial<IProduct>) {
  if (!payload.name || !payload.price || !payload.storeId) throw new Error('name, price and storeId required');
  return ProductRepo.createProduct(payload);
}

export async function getProduct(id: string) {
  return ProductRepo.findProductById(id);
}

export async function updateProduct(id: string, changes: Partial<IProduct>) {
  return ProductRepo.updateProduct(id, changes);
}

export async function searchProducts(q: string, limit = 30) {
  return ProductRepo.searchProductsByText(q, limit);
}

export async function productsByStore(storeId: string, limit = 50) {
  return ProductRepo.findProductsByStore(storeId, limit);
}
