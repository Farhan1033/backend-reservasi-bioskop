import express from 'express';
import scheduleController from '../controllers/scheduleController.js';
import userMiddleware from '../middlewares/userMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/', scheduleController.createSchedule);
router.put('/', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

// Public routes
router.get('/', userMiddleware, scheduleController.getAllSchedules);
router.get('/:id', userMiddleware, scheduleController.getScheduleById);
router.get('/movie/:movieId', userMiddleware, scheduleController.getSchedulesByMovie);

export default router;