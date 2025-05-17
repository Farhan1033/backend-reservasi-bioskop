import { v4 as uuidv4 } from 'uuid';
import Schedule from '../models/Schedules.js';
import Movie from '../models/Movies.js';

class scheduleController {
    static async createSchedule(req, res) {
        try {
            const { movie_id, studio_id, show_time } = req.body;

            if (!movie_id || !studio_id || !show_time) {
                return res.status(400).json({
                    message: "Semua field (movie_id, studio_id, show_time) harus diisi"
                });
            }

            // Cek durasi film
            const movie = await Movie.getAll();
            const selectedMovie = movie.find(m => m.id === movie_id);
            if (!selectedMovie) {
                return res.status(404).json({ message: "Film tidak ditemukan" });
            }

            const showTimeWIB = new Date(`${show_time}:00+07:00`);
            // Cek konflik jadwal
            const hasConflict = await Schedule.checkAvailability(
                studio_id, 
                showTimeWIB, 
                selectedMovie.duration
            );

            if (hasConflict) {
                return res.status(400).json({
                    message: "Studio tidak tersedia pada waktu tersebut"
                });
            }

            const id = uuidv4();
            const scheduleData = new Schedule(id, movie_id, studio_id, showTimeWIB);

            await Schedule.create(scheduleData);

            res.status(201).json({
                message: "Jadwal berhasil ditambahkan",
                schedule: scheduleData
            });
        } catch (error) {
            console.error("Error in createSchedule:", error);
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat menambahkan jadwal"
            });
        }
    }

    static async getAllSchedules(req, res) {
        try {
            const schedules = await Schedule.getAll();
            res.status(200).json({
                message: "Berhasil mendapatkan semua jadwal",
                schedules
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Gagal mendapatkan jadwal", 
                error: error.message 
            });
        }
    }

    static async getScheduleById(req, res) {
        try {
            const { id } = req.params;
            const schedule = await Schedule.getById(id);

            if (!schedule) {
                return res.status(404).json({ 
                    message: "Jadwal tidak ditemukan" 
                });
            }

            res.status(200).json({
                message: "Berhasil mendapatkan jadwal",
                schedule
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Gagal mendapatkan jadwal", 
                error: error.message 
            });
        }
    }

    static async getSchedulesByMovie(req, res) {
        try {
            const { movieId } = req.params;
            const schedules = await Schedule.getByMovie(movieId);

            res.status(200).json({
                message: "Berhasil mendapatkan jadwal untuk film",
                schedules
            });
        } catch (error) {
            res.status(500).json({ 
                message: "Gagal mendapatkan jadwal film", 
                error: error.message 
            });
        }
    }

    static async updateSchedule(req, res) {
        try {
            const { id, movie_id, studio_id, show_time } = req.body;

            if (!id) {
                return res.status(400).json({ message: "ID jadwal harus diisi" });
            }

            const scheduleData = new Schedule(id, movie_id, studio_id, new Date(show_time));
            const result = await Schedule.update(id, scheduleData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    message: "Jadwal tidak ditemukan atau tidak ada perubahan" 
                });
            }

            res.status(200).json({
                message: "Jadwal berhasil diupdate",
                schedule: scheduleData
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSchedule(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID jadwal harus diisi" });
            }

            await Schedule.delete(id);

            res.status(200).json({ 
                message: "Jadwal berhasil dihapus" 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default scheduleController;