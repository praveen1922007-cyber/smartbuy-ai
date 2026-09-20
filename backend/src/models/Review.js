import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    storeId: String,
    user: String,
    text: String,
    status: { type: String, enum: ['genuine', 'suspicious', 'fake'], default: 'genuine' },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
