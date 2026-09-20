import { User, IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as PasswordResetService from './passwordReset.service';

const jwtSecret = process.env.JWT_SECRET || 'change_me';

function createToken(user: IUser) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRY || '7d' } as jwt.SignOptions
  );
}

export async function registerUser(email: string, password: string, name?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed, name });
  await user.save();
  const token = createToken(user);
  return { user, token };
}

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = createToken(user);
  return { user, token };
}

export async function createPasswordResetToken(email: string) {
  return PasswordResetService.createToken(email);
}

export async function resetPassword(token: string, newPassword: string) {
  return PasswordResetService.consumeToken(token, newPassword);
}
