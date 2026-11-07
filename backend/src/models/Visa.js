import mongoose from 'mongoose';

const visaSchema = new mongoose.Schema(
  {
    visaNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attempt: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentAttempt' },
    holderName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, // exactly 6 months after issuance
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' },
    type: { type: String, default: 'Space Travel Visa' },
  },
  { timestamps: true }
);

visaSchema.index({ user: 1, status: 1 });
visaSchema.index({ expiresAt: 1 });

const Visa = mongoose.model('Visa', visaSchema);
export default Visa;
