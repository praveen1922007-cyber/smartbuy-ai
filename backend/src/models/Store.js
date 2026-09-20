import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    rating: Number,
    distanceKm: Number,
    open: Boolean,
    offers: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Store', storeSchema);
