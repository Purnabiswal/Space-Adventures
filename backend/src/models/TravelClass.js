import mongoose from 'mongoose';

const travelClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, lowercase: true },
    displayName: { type: String },
    tagline: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    baseMultiplier: { type: Number, default: 1 },
    perks: [{ type: String }],
    totalSeats: { type: Number, default: 10 },
    bookedSeats: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

travelClassSchema.virtual('availableSeats').get(function () {
  return Math.max(0, this.totalSeats - this.bookedSeats);
});

travelClassSchema.set('toJSON', { virtuals: true });

travelClassSchema.index({ company: 1, packageId: 1, name: 1 }, { unique: true, partialFilterExpression: { packageId: { $type: 'objectId' } } });

const TravelClass = mongoose.model('TravelClass', travelClassSchema);
export default TravelClass;
