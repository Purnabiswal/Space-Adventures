import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', default: null },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    coverImage: { type: String },
    duration: { type: String },
    departureTime: { type: String, default: '09:00' },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    totalSeats: { type: Number, default: 20 },
    bookedSeats: { type: Number, default: 0 },
    departureDate: { type: Date },
    features: [{ type: String }],
    amenities: [{ type: String }],
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], default: 'Moderate' },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

packageSchema.virtual('remainingSeats').get(function () {
  return Math.max(0, this.totalSeats - this.bookedSeats);
});

packageSchema.set('toJSON', { virtuals: true });

const Package = mongoose.model('Package', packageSchema);
export default Package;
