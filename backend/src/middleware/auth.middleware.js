import { verifyToken } from '../utils/token.js';
import { users } from '../data/mockData.js';

export const protect = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = users.find((user) => user.id === decoded.id) || null;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};
