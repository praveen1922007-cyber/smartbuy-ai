import { Schema, model, Document, Types } from 'mongoose';

export interface IPriceHistory extends Document {
  vendorProductId: Types.ObjectId;
  price: number;
  recordedAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>({
  vendorProductId: { type: Schema.Types.ObjectId, ref: 'VendorProduct', required: true },
  price: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now }
});

export const PriceHistory = model<IPriceHistory>('PriceHistory', PriceHistorySchema);
