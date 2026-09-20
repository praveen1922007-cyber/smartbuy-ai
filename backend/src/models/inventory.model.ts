import { Schema, model, Document, Types } from 'mongoose';

export interface IInventory extends Document {
  productId: Types.ObjectId;
  storeId: Types.ObjectId;
  stock: number;
  lastUpdated: Date;
}

const InventorySchema = new Schema<IInventory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  stock: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

InventorySchema.index({ storeId: 1, productId: 1 }, { unique: true });

export const Inventory = model<IInventory>('Inventory', InventorySchema);
