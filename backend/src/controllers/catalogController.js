import Company from '../models/Company.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import TravelClass from '../models/TravelClass.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, companies });
});

export const getCompanyBySlug = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug, isActive: true });
  if (!company) throw new AppError('Company not found', 404);
  const packages = await Package.find({ company: company._id, isActive: true }).populate('destination');
  res.json({ success: true, company, packages });
});

export const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, destinations });
});

export const getFeaturedDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true, featured: true }).limit(6);
  res.json({ success: true, destinations });
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });
  if (!destination) throw new AppError('Destination not found', 404);
  const packages = await Package.find({ destination: destination._id, isActive: true }).populate('company');
  res.json({ success: true, destination, packages });
});

export const getPackages = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.destination) filter.destination = req.query.destination;
  if (req.query.company) filter.company = req.query.company;
  const packages = await Package.find(filter)
    .populate('destination')
    .populate('company')
    .sort({ basePrice: 1 });
  res.json({ success: true, packages });
});

export const getPackageBySlug = asyncHandler(async (req, res) => {
  const pkg = await Package.findOne({ slug: req.params.slug, isActive: true })
    .populate('destination')
    .populate('company');
  if (!pkg) throw new AppError('Package not found', 404);
  const travelClasses = await TravelClass.find({
    $or: [{ packageId: pkg._id }, { packageId: null }],
    isActive: true,
  });
  res.json({ success: true, package: pkg, travelClasses });
});

export const getTravelClasses = asyncHandler(async (req, res) => {
  const travelClasses = await TravelClass.find({ isActive: true });
  res.json({ success: true, travelClasses });
});
