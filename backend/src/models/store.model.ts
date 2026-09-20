import { Schema, model, Document } from 'mongoose';

export interface ILocation {
  type: 'Point';
  coordinates: [number, number]; // [lon, lat]
}

export interface IStore extends Document {
  name: string;
  ownerId?: string;
  address?: string;
  phone?: string;
  rating?: number;
  isOnline?: boolean;
  location?: ILocation;
  createdAt: Date;
}

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true, index: true },
  ownerId: { type: String },
  address: { type: String },
  phone: { type: String },
  rating: { type: Number, default: 4.0 },
  isOnline: { type: Boolean, default: false },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [78.6966, 10.7905] }
  }
}, { timestamps: true });

StoreSchema.index({ location: '2dsphere' });

export const Store = model<IStore>('Store', StoreSchema);
