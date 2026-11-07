import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) token = header.split(' ')[1];
  if (!token) return next(new AppError('Not authorized, no token', 401));

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) return next(new AppError('Not authorized, user not found', 401));

  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
