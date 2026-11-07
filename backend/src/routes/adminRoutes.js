import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  dashboardStats,
  listUsers,
  updateUser,
  adminGetCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  adminGetDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  adminGetPackages,
  createPackage,
  updatePackage,
  deletePackage,
  adminGetClasses,
  createClass,
  updateClass,
  deleteClass,
  adminGetQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAssessmentResults,
  getVisas,
  adminGetBookings,
  updateBookingStatus,
} from '../controllers/adminController.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', dashboardStats);

router.get('/users', listUsers);
router.put('/users/:id', updateUser);

router.get('/companies', adminGetCompanies);
router.post('/companies', createCompany);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

router.get('/destinations', adminGetDestinations);
router.post('/destinations', createDestination);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);

router.get('/packages', adminGetPackages);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

router.get('/travel-classes', adminGetClasses);
router.post('/travel-classes', createClass);
router.put('/travel-classes/:id', updateClass);
router.delete('/travel-classes/:id', deleteClass);

router.get('/questions', adminGetQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/assessment-results', getAssessmentResults);
router.get('/visas', getVisas);

router.get('/bookings', adminGetBookings);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
