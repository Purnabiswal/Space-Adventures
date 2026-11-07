import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import { createDestinationBooking, confirmBooking, cancelBooking, getBookingByReference } from '../services/bookingService.js';
import { getActiveVisa } from '../services/visaService.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('packageId')
    .populate('company')
    .populate('destination')
    .populate('source')
    .populate('travelClass')
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

export const bookDestination = asyncHandler(async (req, res) => {
  const { packageId, travelClassId, departureDate, passengers, sourceSlug, idempotencyKey } = req.body;
  if (!packageId || !travelClassId) throw new AppError('Package and travel class are required', 400);

  const visa = await getActiveVisa(req.user._id);
  if (!visa) throw new AppError('A valid Space Travel Visa is required to book. Pass the astronaut assessment first.', 400);

  const result = await createDestinationBooking({
    user: req.user,
    visa,
    packageId,
    travelClassId,
    departureDate: departureDate ? new Date(departureDate) : undefined,
    passengers,
    sourceSlug,
    idempotencyKey,
  });

  res.status(201).json({ success: true, booking: result.booking, ticket: result.ticket, isDuplicate: result.isDuplicate });
});

export const confirmMyBooking = asyncHandler(async (req, res) => {
  const { bookingReference, idempotencyKey } = req.body;
  if (!bookingReference) throw new AppError('Booking reference is required', 400);

  const { booking } = await getBookingByReference(bookingReference);
  if (String(booking.user) !== String(req.user._id)) throw new AppError('Booking not found', 404);

  const confirmed = await confirmBooking(booking._id);
  const ticket = await Ticket.findOne({ booking: booking._id });

  res.json({ success: true, booking: confirmed, ticket });
});

export const getBookingByRef = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const result = await getBookingByReference(reference);
  if (String(result.booking.user) !== String(req.user._id)) throw new AppError('Booking not found', 404);
  res.json({ success: true, booking: result.booking, ticket: result.ticket });
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);
  const updated = await cancelBooking(booking._id);
  res.json({ success: true, booking: updated });
});
