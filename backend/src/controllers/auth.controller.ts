import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { sendPasswordResetEmail } from '../utils/email';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const { user, token } = await AuthService.registerUser(email, password, name);
    res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.authenticateUser(email, password);
    res.json({ user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Authentication failed' });
  }
}

export async function refreshToken(_req: Request, res: Response) {
  // For simplicity, clients should re-login; implement refresh tokens later
  res.status(501).json({ error: 'Not implemented' });
}

export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const token = await AuthService.createPasswordResetToken(email);
    // send via email (placeholder)
    await sendPasswordResetEmail(email, token);
    res.json({ message: 'Password reset requested' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to request password reset' });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    res.json({ message: 'Password has been reset' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to reset password' });
  }
}
