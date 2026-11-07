import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import TravelClass from '../models/TravelClass.js';
import Company from '../models/Company.js';
import { AppError, asyncHandler } from '../utils/appError.js';

export const getDestinationsForSelector = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, destinations });
});

export const getAvailableRoutes = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  if (!source || !destination) {
    throw new AppError('Source and destination are required', 400);
  }

  const sourceDoc = await Destination.findOne({ slug: source });
  const destDoc = await Destination.findOne({ slug: destination });
  if (!sourceDoc || !destDoc) throw new AppError('Destination not found', 404);

  const journeyDate = date ? new Date(date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Find packages going to the destination
  const packages = await Package.find({
    destination: destDoc._id,
    isActive: true,
    $expr: { $lt: ['$bookedSeats', '$totalSeats'] },
  })
    .populate('company')
    .populate('destination')
    .populate('source')
    .sort({ basePrice: 1 });

  // For each package, get available travel classes
  const routesWithClasses = await Promise.all(
    packages.map(async (pkg) => {
      const travelClasses = await TravelClass.find({
        $or: [
          { packageId: pkg._id },
          { packageId: null },
        ],
        isActive: true,
      });

      const availableClasses = travelClasses
        .filter((tc) => tc.availableSeats > 0)
        .map((tc) => ({
          _id: tc._id,
          name: tc.name,
          slug: tc.slug,
          displayName: tc.displayName,
          tagline: tc.tagline,
          baseMultiplier: tc.baseMultiplier,
          totalSeats: tc.totalSeats,
          availableSeats: tc.availableSeats,
          price: Math.round(pkg.basePrice * tc.baseMultiplier),
          perks: tc.perks,
        }));

      return {
        package: {
          _id: pkg._id,
          name: pkg.name,
          slug: pkg.slug,
          description: pkg.description,
          coverImage: pkg.coverImage || pkg.images?.[0],
          duration: pkg.duration,
          departureTime: pkg.departureTime || '09:00',
          basePrice: pkg.basePrice,
          totalSeats: pkg.totalSeats,
          remainingSeats: pkg.remainingSeats,
          company: pkg.company,
          source: sourceDoc,
          destination: destDoc,
        },
        travelClasses: availableClasses,
      };
    })
  );

  const validRoutes = routesWithClasses.filter((r) => r.travelClasses.length > 0);

  res.json({
    success: true,
    source: sourceDoc,
    destination: destDoc,
    journeyDate,
    routes: validRoutes,
  });
});
