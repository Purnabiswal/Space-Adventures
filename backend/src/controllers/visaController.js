import { getActiveVisa } from '../services/visaService.js';
import Visa from '../models/Visa.js';
import { asyncHandler } from '../utils/appError.js';

export const getMyVisa = asyncHandler(async (req, res) => {
  const active = await getActiveVisa(req.user._id);
  const past = await Visa.find({ user: req.user._id }).sort({ issuedAt: -1 });
  res.json({ success: true, visa: active, past });
});
