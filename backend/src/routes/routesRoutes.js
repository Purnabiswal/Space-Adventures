import { Router } from 'express';
import { getDestinationsForSelector, getAvailableRoutes } from '../controllers/routesController.js';

const router = Router();

router.get('/destinations', getDestinationsForSelector);
router.get('/available', getAvailableRoutes);

export default router;
