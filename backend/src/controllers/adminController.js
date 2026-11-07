import User from '../models/User.js';
import Company from '../models/Company.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import TravelClass from '../models/TravelClass.js';
import Question from '../models/Question.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import Visa from '../models/Visa.js';
import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import { AppError, asyncHandler } from '../utils/appError.js';
import { generateReference } from '../utils/jwt.js';

function slugify(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const dashboardStats = asyncHandler(async (req, res) => {
  const [users, companies, destinations, packages, bookings, attempts, visas] = await Promise.all([
    User.countDocuments(),
    Company.countDocuments(),
    Destination.countDocuments(),
    Package.countDocuments(),
    Booking.countDocuments(),
    AssessmentAttempt.countDocuments(),
    Visa.countDocuments(),
  ]);
  res.json({ success: true, stats: { users, companies, destinations, packages, bookings, attempts, visas } });
});

// ------- Users -------
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role, isActive }, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, user });
});

// ------- Companies -------
export const adminGetCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ name: 1 });
  res.json({ success: true, companies });
});

export const createCompany = asyncHandler(async (req, res) => {
  const { name, type, tagline, about, realWorldScope, fictionalDisclaimer, headquarters, founded, logo, coverImage } = req.body;
  const exists = await Company.findOne({ name });
  if (exists) throw new AppError('Company already exists', 400);
  const company = await Company.create({
    name,
    slug: req.body.slug || slugify(name),
    type,
    tagline,
    about,
    realWorldScope,
    fictionalDisclaimer,
    headquarters,
    founded,
    logo,
    coverImage,
  });
  res.status(201).json({ success: true, company });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!company) throw new AppError('Company not found', 404);
  res.json({ success: true, company });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ------- Destinations -------
export const adminGetDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort({ name: 1 });
  res.json({ success: true, destinations });
});

export const createDestination = asyncHandler(async (req, res) => {
  const existing = await Destination.findOne({ name: req.body.name });
  if (existing) throw new AppError('Destination already exists', 400);
  const destination = await Destination.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) });
  res.status(201).json({ success: true, destination });
});

export const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!destination) throw new AppError('Destination not found', 404);
  res.json({ success: true, destination });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ------- Packages -------
export const adminGetPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().populate('destination').populate('company').sort({ createdAt: -1 });
  res.json({ success: true, packages });
});

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await Package.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) });
  res.status(201).json({ success: true, package: pkg });
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pkg) throw new AppError('Package not found', 404);
  res.json({ success: true, package: pkg });
});

export const deletePackage = asyncHandler(async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ------- Travel classes -------
export const adminGetClasses = asyncHandler(async (req, res) => {
  const travelClasses = await TravelClass.find().populate('company').populate('packageId');
  res.json({ success: true, travelClasses });
});

export const createClass = asyncHandler(async (req, res) => {
  const travelClass = await TravelClass.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) });
  res.status(201).json({ success: true, travelClass });
});

export const updateClass = asyncHandler(async (req, res) => {
  const travelClass = await TravelClass.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!travelClass) throw new AppError('Travel class not found', 404);
  res.json({ success: true, travelClass });
});

export const deleteClass = asyncHandler(async (req, res) => {
  await TravelClass.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ------- Questions -------
export const adminGetQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find().sort({ category: 1 });
  res.json({ success: true, questions });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const question = await Question.create(req.body);
  res.status(201).json({ success: true, question });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!question) throw new AppError('Question not found', 404);
  res.json({ success: true, question });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ------- Assessment results & visas -------
export const getAssessmentResults = asyncHandler(async (req, res) => {
  const attempts = await AssessmentAttempt.find({ status: 'submitted' }).populate('user', 'name email').sort({ submittedAt: -1 }).limit(200);
  res.json({ success: true, attempts });
});

export const getVisas = asyncHandler(async (req, res) => {
  const visas = await Visa.find().populate('user', 'name email').sort({ issuedAt: -1 }).limit(200);
  res.json({ success: true, visas });
});

// ------- Bookings -------
export const adminGetBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('company')
    .populate('destination')
    .populate('travelClass')
    .sort({ createdAt: -1 });
  res.json({ success: true, bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed', 'expired'].includes(status)) {
    throw new AppError('Invalid booking status', 400);
  }
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, booking });
});
