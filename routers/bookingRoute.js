import express from "express";
import userMiddleware from "../middlewares/userMiddleware";
import bookingController from "../controllers/bookingController";

const route = express.Router();

route.post('add-booking', userMiddleware, bookingController.addBooking);

export default route;