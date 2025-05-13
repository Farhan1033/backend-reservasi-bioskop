import express from 'express';
import reservationController from '../controllers/reservationController.js';

const router = express.Router();

// Protected routes
router.post('/', reservationController.createReservation);
router.put('/status', reservationController.updateReservationStatus);
router.patch('/:id/cancel', reservationController.cancelReservation);
router.get('/user/:userId', reservationController.getUserReservations);

// Admin routes
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.delete('/:id', reservationController.deleteReservation);

export default router;