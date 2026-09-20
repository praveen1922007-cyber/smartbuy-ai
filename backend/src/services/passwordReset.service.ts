import crypto from 'crypto';
import { PasswordReset } from '../models/passwordReset.model';
import { User } from '../models/user.model';

export async function createToken(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  const pr = new PasswordReset({ email, token, expiresAt });
  await pr.save();
  return token;
}

export async function consumeToken(token: string, newPassword: string) {
  const pr = await PasswordReset.findOne({ token });
  if (!pr) throw new Error('Invalid or expired token');
  if (pr.expiresAt < new Date()) {
    await pr.deleteOne();
    throw new Error('Token expired');
  }
  const user = await User.findOne({ email: pr.email });
  if (!user) throw new Error('User not found');
  // update password
  const bcrypt = await import('bcryptjs');
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  await pr.deleteOne();
}
