import express from "express";
import userMiddleware from "../middlewares/userMiddleware.js";
import bookingController from "../controllers/bookingController.js";

const route = express.Router();

route.post('/add-booking', userMiddleware, bookingController.addBooking);
route.get('/:id', bookingController.findById);
route.get('/', userMiddleware, bookingController.getAll);

export default route;