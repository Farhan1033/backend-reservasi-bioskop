import express from 'express';
import scheduleController from '../controllers/scheduleController.js';

const router = express.Router();

// Admin routes
router.post('/', scheduleController.createSchedule);
router.put('/', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

// Public routes
router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.get('/movie/:movieId', scheduleController.getSchedulesByMovie);

export default router;