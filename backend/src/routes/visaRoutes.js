import { Router } from 'express';
import { getMyVisa } from '../controllers/visaController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/me', protect, getMyVisa);
export default router;
