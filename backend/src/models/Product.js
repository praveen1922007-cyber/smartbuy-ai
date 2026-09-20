import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: Number,
    quantity: String,
    quality: String,
    stock: Number,
    storeId: String,
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
