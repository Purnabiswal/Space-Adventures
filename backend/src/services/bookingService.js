import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Package from '../models/Package.js';
import TravelClass from '../models/TravelClass.js';
import Destination from '../models/Destination.js';
import { generateReference } from '../utils/jwt.js';
import { generateSeatNumber } from '../utils/seat.js';
import { AppError } from '../utils/appError.js';

export async function createDestinationBooking({ user, visa, packageId, travelClassId, departureDate, passengers, sourceSlug, idempotencyKey }) {
  // Idempotency check
  if (idempotencyKey) {
    const existing = await Booking.findOne({ idempotencyKey });
    if (existing) {
      const ticket = await Ticket.findOne({ booking: existing._id });
      return { booking: existing, ticket, isDuplicate: true };
    }
  }

  const pkg = await Package.findById(packageId).populate('destination');
  if (!pkg) throw new AppError('Package not found', 404);
  if (!pkg.isActive) throw new AppError('Package is not available', 400);

  const travelClass = await TravelClass.findById(travelClassId);
  if (!travelClass || !travelClass.isActive) {
    throw new AppError('Travel class not found', 400);
  }

  // Validate and reduce travel class seat count atomically
  const updatedClass = await TravelClass.findOneAndUpdate(
    { _id: travelClassId, isActive: true, $expr: { $lt: ['$bookedSeats', '$totalSeats'] } },
    { $inc: { bookedSeats: 1 } },
    { new: true }
  );
  if (!updatedClass) throw new AppError('No seats available in this class', 400);

  // Reduce package global seat count
  const updatedPkg = await Package.findOneAndUpdate(
    { _id: packageId, isActive: true, $expr: { $lt: ['$bookedSeats', '$totalSeats'] } },
    { $inc: { bookedSeats: 1 } },
    { new: true }
  );
  if (!updatedPkg) {
    // Rollback travel class seat
    await TravelClass.updateOne({ _id: travelClassId }, { $inc: { bookedSeats: -1 } }).catch(() => {});
    throw new AppError('No seats available for this package', 400);
  }

  const source = sourceSlug ? await Destination.findOne({ slug: sourceSlug }) : null;

  const passengerCount = passengers && passengers.length > 0 ? passengers.length : 1;
  const passengerList = passengers && passengers.length > 0
    ? passengers.map((p) => ({
        name: p.name || user.name,
        age: p.age || null,
        berth: p.berth || 'any',
      }))
    : [{ name: user.name, berth: 'any' }];

  const totalPrice = Math.round(pkg.basePrice * travelClass.baseMultiplier * passengerCount);

  let depart = departureDate ? new Date(departureDate) : pkg.departureDate;
  if (!depart || isNaN(depart.getTime())) {
    depart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const seatNumber = generateSeatNumber(String(pkg._id), pkg.totalSeats, updatedPkg.bookedSeats);

  try {
    const booking = await Booking.create({
      bookingReference: generateReference('ANT-BKG', 8),
      user: user._id,
      packageId: pkg._id,
      source: source ? source._id : undefined,
      destination: pkg.destination,
      company: pkg.company,
      travelClass: travelClass._id,
      visa: visa._id,
      passengers: passengerList,
      departureDate: depart,
      basePrice: pkg.basePrice,
      classMultiplier: travelClass.baseMultiplier,
      totalPrice,
      seatNumber,
      idempotencyKey: idempotencyKey || undefined,
      passengerCount,
      status: 'pending',
    });

    const ticket = await Ticket.create({
      ticketNumber: generateReference('ANT-TKT', 8),
      booking: booking._id,
      user: user._id,
      isFictional: true,
    });

    return { booking, ticket, isDuplicate: false };
  } catch (err) {
    await Package.updateOne({ _id: packageId }, { $inc: { bookedSeats: -1 } }).catch(() => {});
    await TravelClass.updateOne({ _id: travelClassId }, { $inc: { bookedSeats: -1 } }).catch(() => {});
    throw err;
  }
}

export async function confirmBooking(bookingId) {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, status: 'pending' },
    { status: 'confirmed', paymentStatus: 'paid' },
    { new: true }
  );
  if (!booking) throw new AppError('Booking cannot be confirmed', 400);
  return booking;
}

export async function cancelBooking(bookingId) {
  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId, status: { $in: ['pending', 'confirmed'] } },
    { status: 'cancelled' },
    { new: true }
  );
  if (!booking) throw new AppError('Booking cannot be cancelled', 400);

  await Package.updateOne({ _id: booking.packageId }, { $inc: { bookedSeats: -1 } }).catch(() => {});
  await TravelClass.updateOne({ _id: booking.travelClass }, { $inc: { bookedSeats: -1 } }).catch(() => {});
  await Ticket.updateOne({ booking: booking._id }, { $unset: { qrDataUrl: 1 } }).catch(() => {});
  return booking;
}

export async function getBookingByReference(reference) {
  const booking = await Booking.findOne({ bookingReference: reference })
    .populate('packageId')
    .populate('company')
    .populate('destination')
    .populate('source')
    .populate('travelClass')
    .populate('visa');
  if (!booking) throw new AppError('Booking not found', 404);
  const ticket = await Ticket.findOne({ booking: booking._id });
  return { booking, ticket };
}
