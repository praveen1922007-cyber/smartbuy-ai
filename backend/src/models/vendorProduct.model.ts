import { Schema, model, Document, Types } from 'mongoose';

export interface IVendorProduct extends Document {
  vendorId: Types.ObjectId;
  externalId: string; // id on vendor platform
  name: string;
  barcode?: string;
  price: number;
  mrp?: number;
  availability?: boolean;
  url?: string;
  fetchedAt: Date;
}

const VendorProductSchema = new Schema<IVendorProduct>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  externalId: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  barcode: { type: String, index: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  availability: { type: Boolean, default: true },
  url: { type: String },
  fetchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

VendorProductSchema.index({ name: 'text' });

export const VendorProduct = model<IVendorProduct>('VendorProduct', VendorProductSchema);
