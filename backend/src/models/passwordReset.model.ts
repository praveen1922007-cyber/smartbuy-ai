import { Schema, model, Document } from 'mongoose';

export interface IPasswordReset extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  email: { type: String, required: true, index: true },
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true }
});

export const PasswordReset = model<IPasswordReset>('PasswordReset', PasswordResetSchema);
