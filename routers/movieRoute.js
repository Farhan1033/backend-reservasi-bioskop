import movieController from "../controllers/movieController.js";
import express from "express";

const route = express.Router();

route.post('/add-movies', movieController.addMovie)
route.get('/', movieController.getAllMovie)
route.get('/search', movieController.searchMovie)
route.put('/update-movies', movieController.updateMovie)
route.delete('/delete-movies', movieController.deleteMovie)

export default route;