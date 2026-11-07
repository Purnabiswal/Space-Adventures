import User from '../models/User.js';
import { signToken, generateReference } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, nationality } = req.body;
  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError('An account with this email already exists', 400);

  const user = await User.create({ name, email, password, phone, nationality });
  const token = signToken(user);
  res.status(201).json({ success: true, token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is disabled', 403);
  const token = signToken(user);
  res.json({ success: true, token, user });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, nationality } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, nationality },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
});
