import { Router } from 'express';
import {
  getCompanies,
  getCompanyBySlug,
  getDestinations,
  getFeaturedDestinations,
  getDestinationBySlug,
  getPackages,
  getPackageBySlug,
  getTravelClasses,
} from '../controllers/catalogController.js';

const router = Router();

router.get('/companies', getCompanies);
router.get('/companies/:slug', getCompanyBySlug);

router.get('/destinations', getDestinations);
router.get('/destinations/featured', getFeaturedDestinations);
router.get('/destinations/:slug', getDestinationBySlug);

router.get('/packages', getPackages);
router.get('/packages/:slug', getPackageBySlug);

router.get('/travel-classes', getTravelClasses);

export default router;
