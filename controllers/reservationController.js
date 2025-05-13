import { v4 as uuidv4 } from 'uuid';
import Reservation from '../models/Reservations.js';
import Schedule from '../models/Schedules.js';
import Seat from '../models/Seats.js';

class reservationController {
    static async createReservation(req, res) {
        try {
            const { user_id, schedule_id, seat_id } = req.body;

            if (!user_id || !schedule_id || !seat_id) {
                return res.status(400).json({
                    message: "Semua field (user_id, schedule_id, seat_id) harus diisi"
                });
            }

            // Cek ketersediaan kursi
            const isAvailable = await Reservation.checkAvailability(schedule_id, seat_id);
            if (!isAvailable) {
                return res.status(400).json({
                    message: "Kursi sudah dipesan"
                });
            }

            // Cek apakah kursi ada di studio yang sesuai dengan jadwal
            const schedule = await Schedule.getById(schedule_id);
            const seat = await Seat.getById(seat_id);

            if (!schedule) {
                return res.status(404).json({
                    message: "Jadwal tidak ditemukan"
                });
            }

            if (!seat) {
                return res.status(404).json({
                    message: "Kursi tidak ditemukan"
                });
            }

            if (seat.studio_id !== schedule.studio_id) {
                return res.status(400).json({
                    message: "Kursi tidak tersedia di studio untuk jadwal ini"
                });
            }

            const id = uuidv4();
            const reservationData = new Reservation(id, user_id, schedule_id, seat_id);

            await Reservation.create(reservationData);

            res.status(201).json({
                message: "Reservasi berhasil dibuat",
                reservation: {
                    id,
                    user_id,
                    schedule_id,
                    seat_id,
                    status: 'reserved',
                    reserved_at: new Date()
                }
            });
        } catch (error) {
            console.error("Error in createReservation:", error);
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat membuat reservasi"
            });
        }
    }

    static async getAllReservations(req, res) {
        try {
            const reservations = await Reservation.getAll();
            res.status(200).json({
                message: "Berhasil mendapatkan semua reservasi",
                reservations
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mendapatkan reservasi",
                error: error.message
            });
        }
    }

    static async getReservationById(req, res) {
        try {
            const { id } = req.params;
            const reservation = await Reservation.getById(id);

            if (!reservation) {
                return res.status(404).json({
                    message: "Reservasi tidak ditemukan"
                });
            }

            res.status(200).json({
                message: "Berhasil mendapatkan reservasi",
                reservation
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mendapatkan reservasi",
                error: error.message
            });
        }
    }

    static async getUserReservations(req, res) {
        try {
            const { userId } = req.params;
            const reservations = await Reservation.getByUser(userId);

            res.status(200).json({
                message: "Berhasil mendapatkan reservasi pengguna",
                reservations
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mendapatkan reservasi pengguna",
                error: error.message
            });
        }
    }

    static async updateReservationStatus(req, res) {
        try {
            const { id, status } = req.body;

            if (!id || !['reserved', 'cancelled', 'paid'].includes(status)) {
                return res.status(400).json({
                    message: "ID dan status yang valid harus disediakan"
                });
            }

            const result = await Reservation.updateStatus(id, status);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Reservasi tidak ditemukan"
                });
            }

            res.status(200).json({
                message: `Status reservasi berhasil diubah menjadi ${status}`,
                reservation_id: id
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async cancelReservation(req, res) {
        try {
            const { id } = req.params;
            const { user_id } = req.body;

            // Verifikasi reservasi milik user
            const reservation = await Reservation.getById(id);
            if (!reservation || reservation.user_id !== user_id) {
                return res.status(404).json({
                    message: "Reservasi tidak ditemukan atau tidak memiliki akses"
                });
            }

            await Reservation.updateStatus(id, 'cancelled');

            res.status(200).json({
                message: "Reservasi berhasil dibatalkan"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteReservation(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID reservasi harus diisi" });
            }

            await Reservation.delete(id);

            res.status(200).json({
                message: "Reservasi berhasil dihapus"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default reservationController;