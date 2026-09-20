import { Schema, model, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  code: string; // e.g. 'amazon', 'flipkart'
  logo?: string;
  enabled: boolean;
  createdAt: Date;
}

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true, index: true },
  code: { type: String, required: true, unique: true, index: true },
  logo: { type: String },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

export const Vendor = model<IVendor>('Vendor', VendorSchema);
