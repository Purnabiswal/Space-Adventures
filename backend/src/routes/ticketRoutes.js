import { Router } from 'express';
import { getMyTickets, getTicket, downloadTicket, verifyTicket } from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/verify', verifyTicket);
router.get('/my', protect, getMyTickets);
router.get('/:ticketNumber', protect, getTicket);
router.get('/:ticketNumber/download', protect, downloadTicket);

export default router;
