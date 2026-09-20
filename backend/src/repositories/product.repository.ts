import { Product, IProduct } from '../models/product.model';
import { Types } from 'mongoose';

export async function createProduct(payload: Partial<IProduct>) {
  const p = new Product(payload);
  return p.save();
}

export async function findProductById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return Product.findById(id).populate('category').lean();
}

export async function updateProduct(id: string, changes: Partial<IProduct>) {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid id');
  return Product.findByIdAndUpdate(id, changes, { new: true });
}

export async function searchProductsByText(q: string, limit = 30) {
  if (!q) return Product.find().limit(limit).lean();
  return Product.find({ $text: { $search: q } }).limit(limit).lean();
}

export async function findProductsByStore(storeId: string, limit = 50) {
  if (!Types.ObjectId.isValid(storeId)) return [];
  return Product.find({ storeId }).limit(limit).lean();
}
