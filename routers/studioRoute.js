import studioController from "../controllers/studioController.js";
import express from "express";

const route = express.Router();

route.post('/add-studios', studioController.addStudio)
route.get('/get-studios', studioController.getAllStudio)
route.put('/update-studios', studioController.updateStudio)
route.delete('/delete-studios', studioController.deleteStudio)

export default route;