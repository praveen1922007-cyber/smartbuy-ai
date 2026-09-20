import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  productId: Types.ObjectId;
  userId?: Types.ObjectId;
  rating: number;
  text?: string;
  isFake?: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  text: { type: String },
  isFake: { type: Boolean, default: false }
}, { timestamps: true });

export const Review = model<IReview>('Review', ReviewSchema);
