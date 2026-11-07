import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Package from '../models/Package.js';
import Company from '../models/Company.js';
import Destination from '../models/Destination.js';
import TravelClass from '../models/TravelClass.js';
import Visa from '../models/Visa.js';
import { AppError } from '../utils/appError.js';

function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export async function buildTicketData(ticket) {
  const booking = await Booking.findById(ticket.booking)
    .populate('packageId')
    .populate('company')
    .populate('destination')
    .populate('travelClass')
    .populate('visa');
  if (!booking) throw new AppError('Booking not found', 404);

  const qrContent = JSON.stringify({
    t: ticket.ticketNumber,
    b: booking.bookingReference,
    v: booking.passengerName,
  });

  const qrDataUrl = await QRCode.toDataURL(qrContent, { width: 180, margin: 1 });

  ticket.qrCode = qrContent;
  ticket.qrDataUrl = qrDataUrl;
  await ticket.save();

  return { ticket, booking, qrContent };
}

const PURPLE = '#6D28D9';
const BLUE = '#1E3A8A';
const DARK = '#0B1026';
const SAFFRON = '#FF9933';

function drawHeader(doc) {
  doc.rect(0, 0, doc.page.width, 90).fill(DARK);
  doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text('ANTARIKSH', 40, 24, { lineBreak: false });
  doc.fillColor('#D8B4FE').fontSize(11).font('Helvetica').text('India\'s Gateway to Space', 40, 54);
  doc.fillColor(SAFFRON).rect(doc.page.width - 210, 20, 170, 50).roundedRect(doc.page.width - 210, 20, 170, 50, 8).fill();
  doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold').text('SIMULATED', doc.page.width - 200, 28);
  doc.fillColor(DARK).fontSize(8).font('Helvetica').text('FICTIONAL RESERVATION', doc.page.width - 200, 44);
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica').text('Not a real spaceflight', doc.page.width - 175, 68);
}

export async function generateTicketPdf(ticket) {
  const { booking } = await buildTicketData(ticket);
  const pkg = booking.packageId;
  const company = booking.company;
  const dest = booking.destination;
  const tclass = booking.travelClass;

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve, reject) => {
    doc.on('end', resolve);
    doc.on('error', reject);
  });

  drawHeader(doc);

  // Passenger + itinerary block
  doc.y = 120;
  doc.fontSize(13).font('Helvetica-Bold').fillColor(PURPLE).text('BOARDING PASS');
  doc.fontSize(10).font('Helvetica').fillColor('#333');
  doc.moveDown(0.5);
  doc.text(`Passenger: ${booking.passengerName}`);
  doc.text(`Booking Ref: ${booking.bookingReference}`);
  doc.text(`Ticket No: ${ticket.ticketNumber}`);

  doc.moveDown(1);
  doc.fontSize(13).font('Helvetica-Bold').fillColor(PURPLE).text('JOURNEY');
  doc.fontSize(10).font('Helvetica').fillColor('#333');
  doc.moveDown(0.5);
  doc.text(`From: Earth  (${company ? company.name : '—'})`);
  doc.text(`To: ${dest ? dest.name : '—'}  (${dest ? dest.type : ''})`);
  doc.text(`Departure: ${fmtDate(booking.departureDate)}`);
  doc.text(`Duration: ${pkg ? pkg.duration : '—'}`);
  doc.text(`Travel Class: ${tclass ? tclass.name : '—'}`);
  doc.text(`Seat: ${booking.seatNumber || '—'}`);
  doc.text(`Total Price: ${fmtINR(booking.totalPrice)}`);
  doc.text(`Status: ${booking.status.toUpperCase()}`);
  doc.text(`Visa No: ${booking.visa ? booking.visa.visaNumber : '—'}`);

  // QR block on right
  const qr = ticket.qrDataUrl;
  if (qr) {
    try {
      const img = qr.replace(/^data:image\/png;base64,/, '');
      doc.image(Buffer.from(img, 'base64'), doc.page.width - 170, 120, { width: 110 });
      doc.fillColor('#666').fontSize(8).font('Helvetica').text('Scan to verify', doc.page.width - 150, 235, { width: 100, align: 'center' });
    } catch (e) {
      doc.text('QR unavailable', doc.page.width - 170, 130);
    }
  }

  doc.moveDown(2);
  doc.fontSize(8).font('Helvetica').fillColor('#888');
  doc.text('This is a fictional simulated reservation on the ANTARIKSH platform. ANTARIKSH and the named companies do not currently provide real passenger space-tourism services.', { width: 500 });

  doc.end();
  await done;
  return Buffer.concat(chunks);
}
