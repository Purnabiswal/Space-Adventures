import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    berth: { type: String, enum: ['lower', 'middle', 'upper', 'window', 'aisle', 'any'], default: 'any' },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    travelClass: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelClass', required: true },
    visa: { type: mongoose.Schema.Types.ObjectId, ref: 'Visa', required: true },
    passengers: [passengerSchema],
    departureDate: { type: Date, required: true },
    basePrice: { type: Number, required: true },
    classMultiplier: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    seatNumber: { type: String },
    idempotencyKey: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    passengerCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ departureDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
