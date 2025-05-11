import { v4 as uuidv4 } from 'uuid'
import Movies from '../models/Movies.js'

class movieController {
    static async addMovie(req, res) {
        try {
            const { title, description, duration, poster_url, create_at } = req.body

            const existingMovie = await Movies.findByTitle(title)
            if (existingMovie) {
                return res.status(400).json({ message: "Film sudah ada di list" })
            }

            const id = uuidv4();

            const movieData = new Movies(id, title, description, duration, poster_url, create_at)

            await Movies.createMovies(movieData);

            res.status(200).json({
                message: "Film berhasil ditambahkan",
                movie: {
                    title,
                    description,
                    duration,
                    poster_url,
                    create_at
                }
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async getAllMovie(req, res) {
        try {
            const movieData = await Movies.getAll();
            res.status(200).json({
                message: "Berhasil Menampilkan Semua Film",
                movie: movieData
            })
        } catch (error) {
            res.status(500).json({ message: "Gagal menampilkan data", error: error.message });
        }
    }

    static async searchMovie(req, res) {
        try {
            const { title } = req.query

            if (!title) return res.status(400).json({ message: "Silahkan masukkan judul yang ingin dicari" })

            const movieData = await Movies.findByTitle(title)

            if (!movieData) return res.status(404).json({ message: "Film tidak ditemukan" })

            res.status(200).json({
                message: "Film berhasil ditemukan",
                movieData
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async updateMovie(req, res) {
        try {
            const { id, title, description, duration, poster_url } = req.body;

            if (!id) {
                return res.status(400).json({ message: "ID tidak boleh kosong" });
            }

            const movieData = new Movies(id, title, description, duration, poster_url);

            const result = await Movies.updateMovies(movieData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Film tidak ditemukan atau tidak ada perubahan" });
            }

            res.status(200).json({
                message: "Film berhasil diupdate",
                movie: {
                    id,
                    title,
                    description,
                    duration,
                    poster_url
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteMovie(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ message: "ID Film Tidak Ditemukan" });
            }

            await Movies.deleteMovie(id)

            res.status(200).json({ message: "Film berhasil dihapus" })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

}

export default movieController;