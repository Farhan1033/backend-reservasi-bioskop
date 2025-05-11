import express from "express";
import userController from "../controllers/userController.js";

const route = express.Router()

route.post('/register', userController.register)

export default route;