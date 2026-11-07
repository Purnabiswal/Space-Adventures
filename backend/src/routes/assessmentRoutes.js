import { Router } from 'express';
import {
  getAssessmentConfig,
  getStatus,
  startAssessment,
  submitAssessment,
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/config', getAssessmentConfig);
router.get('/status', protect, getStatus);
router.post('/start', protect, startAssessment);
router.post('/submit', protect, submitAssessment);

export default router;
