import express from 'express';
import seatController from '../controllers/seatController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/add-seat', seatController.createSeat);
router.post('/bulk', seatController.createBulkSeats);
router.put('/update-seat', seatController.updateSeat);
router.delete('/delete-seat/:id', seatController.deleteSeat);
router.patch('/deactivate/:id', seatController.deactivateSeat);

// Public routes
router.get('/studio/:studioId', userMiddleware, seatController.getSeatsByStudio);
router.get('/available/:scheduleId', userMiddleware, seatController.getAvailableSeats);

export default router;