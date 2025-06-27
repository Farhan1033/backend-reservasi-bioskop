import express from 'express';
import reservationController from '../controllers/reservationController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/bulk', userMiddleware, reservationController.createBulkReservation);
router.put('/status', userMiddleware, reservationController.updateReservationStatus);
router.patch('/:id/cancel', userMiddleware, reservationController.cancelReservation);
router.get('/booking/:bookingId', userMiddleware, reservationController.getBookingReservations);
router.get('/schedule/:id/booked-seats', reservationController.getBookedSeatsBySchedule);

// Admin routes
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.delete('/:id', reservationController.deleteReservation);
router.patch('/reset/:schedule_id', reservationController.resetReservationsBySchedule);

export default router;