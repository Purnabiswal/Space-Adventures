import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrCode: { type: String },
    qrDataUrl: { type: String },
    pdfPath: { type: String },
    issuedAt: { type: Date, default: Date.now },
    isFictional: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ticketSchema.index({ user: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
