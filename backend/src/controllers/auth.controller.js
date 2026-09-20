import { users } from '../data/mockData.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = users.some((user) => user.email === email);
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: 'customer',
    };

    users.push(user);
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = users.find((entry) => entry.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Session expired' });
  }

  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
