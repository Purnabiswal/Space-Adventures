import { Router } from 'express';
import { getMyBookings, bookDestination, confirmMyBooking, getBookingByRef, cancelMyBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', getMyBookings);
router.get('/reference/:reference', getBookingByRef);
router.post('/destination-book', bookDestination);
router.post('/confirm', confirmMyBooking);
router.put('/:id/cancel', cancelMyBooking);
export default router;
