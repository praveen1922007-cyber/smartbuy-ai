import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand?: string;
  category?: Types.ObjectId;
  description?: string;
  barcode?: string;
  mrp?: number;
  price: number;
  discount?: number;
  stock?: number;
  rating?: number;
  images?: string[];
  storeId: Types.ObjectId;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  brand: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  description: { type: String },
  barcode: { type: String, index: true },
  mrp: { type: Number },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 4.0 },
  images: { type: [String], default: [] },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true }
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });

export const Product = model<IProduct>('Product', ProductSchema);
