import Ticket from '../models/Ticket.js';
import Booking from '../models/Booking.js';
import { buildTicketData, generateTicketPdf } from '../services/ticketService.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id })
    .populate({ path: 'booking', populate: [{ path: 'destination' }, { path: 'company' }, { path: 'packageId' }] })
    .sort({ issuedAt: -1 });
  res.json({ success: true, tickets });
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber }).populate({
    path: 'booking',
    populate: [{ path: 'destination' }, { path: 'company' }, { path: 'travelClass' }, { path: 'packageId' }],
  });
  if (!ticket) throw new AppError('Ticket not found', 404);
  await buildTicketData(ticket);
  res.json({ success: true, ticket });
});

export const downloadTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({ ticketNumber: req.params.ticketNumber });
  if (!ticket) throw new AppError('Ticket not found', 404);

  const booking = await Booking.findById(ticket.booking);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'confirmed' && booking.status !== 'completed') {
    throw new AppError('This booking is not valid for a ticket', 400);
  }

  const pdf = await generateTicketPdf(ticket);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="antariksh-ticket-${ticket.ticketNumber}.pdf"`);
  res.send(pdf);
});

export const verifyTicket = asyncHandler(async (req, res) => {
  const { ticketNumber } = req.body;
  if (!ticketNumber) throw new AppError('Ticket number is required', 400);
  const ticket = await Ticket.findOne({ ticketNumber }).populate({
    path: 'booking',
    populate: [{ path: 'destination' }, { path: 'company' }],
  });
  if (!ticket) throw new AppError('Invalid ticket number', 404);

  const valid = ticket.booking && ticket.booking.status === 'confirmed';
  res.json({ success: true, valid, ticket });
});
