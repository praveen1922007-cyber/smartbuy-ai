import { Request, Response } from 'express';
import { Product } from '../models/product.model';

export async function compareProducts(req: Request, res: Response) {
  try {
    // Accept query param q or barcode to find similar products across stores
    const { name, barcode } = req.query;
    let products: any[] = [];
    if (barcode) {
      products = await Product.find({ barcode: String(barcode) }).populate('storeId').lean();
    } else if (name) {
      products = await Product.find({ $text: { $search: String(name) } }).populate('storeId').lean();
    } else {
      return res.status(400).json({ error: 'name or barcode required' });
    }
    // return sorted by price asc
    products.sort((a, b) => a.price - b.price);
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Comparison failed' });
  }
}
