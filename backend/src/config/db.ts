import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbuy';
  try {
    await mongoose.connect(uri, {
      // keep defaults for Mongoose 7+; options removed
    } as mongoose.ConnectOptions);
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', err);
    throw err;
  }
}
