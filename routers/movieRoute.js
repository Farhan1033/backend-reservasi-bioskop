import { getAllMovies, addMovies, editMovies, deleteMovies } from "../controllers/movieController.js";
import express from 'express';

const router = express.Router();

router.get('/movies', getAllMovies)
router.post('/add-movies', addMovies)
router.put('/edit-movies/:id', editMovies)
router.delete('/delete-movies/:id', deleteMovies)

export default router;