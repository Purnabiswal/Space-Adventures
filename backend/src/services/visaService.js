import Visa from '../models/Visa.js';
import { generateReference } from '../utils/jwt.js';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export function visaExpiresAt(issued = new Date()) {
  return new Date(issued.getTime() + SIX_MONTHS_MS);
}

export async function getActiveVisa(userId) {
  const visa = await Visa.findOne({ user: userId, status: 'active' })
    .sort({ expiresAt: -1 })
    .populate('attempt');
  if (!visa) return null;

  if (visa.expiresAt < new Date()) {
    visa.status = 'expired';
    await visa.save();
    return null;
  }
  return visa;
}

export async function issueVisaFromAttempt(user, attempt) {
  const existing = await Visa.findOne({ user: user._id, status: 'active' });
  if (existing) return existing;

  const issuedAt = new Date();
  const visa = await Visa.create({
    visaNumber: generateReference('ANT-VISA', 8),
    user: user._id,
    attempt: attempt._id,
    holderName: user.name,
    issuedAt,
    expiresAt: visaExpiresAt(issuedAt),
    type: 'Space Travel Visa',
  });
  return visa;
}
