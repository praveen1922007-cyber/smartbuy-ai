import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  role: 'customer' | 'store' | 'admin';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['customer', 'store', 'admin'], default: 'customer' }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);
