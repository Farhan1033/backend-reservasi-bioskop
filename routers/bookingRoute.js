import express from "express";
import userMiddleware from "../middlewares/userMiddleware.js";
import bookingController from "../controllers/bookingController.js";

const route = express.Router();
//admin
route.get('/data-admin', bookingController.getAllDataAdmin);

route.post('/add-booking', userMiddleware, bookingController.addBooking);
route.get('/', userMiddleware, bookingController.getAll);
route.get('/:id', bookingController.findById);


export default route;