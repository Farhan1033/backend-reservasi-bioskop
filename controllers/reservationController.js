import { v4 as uuidv4 } from 'uuid';
import Reservation from '../models/Reservations.js';
import Schedule from '../models/Schedules.js';
import Seat from '../models/Seats.js';
import Bookings from '../models/Bookings.js';
import reservationRepository from '../Repositories/reservationRepository.js';

class reservationController {
    static async createBulkReservation(req, res) {
        try {
            const { booking_id, seat_ids } = req.body;

            if (!booking_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
                return res.status(400).json({
                    message: "Field user_id, booking_id, dan seat_ids (array) harus diisi"
                });
            }

            if (seat_ids.length > 10) {
                return res.status(400).json({
                    message: "Maksimal 10 kursi dapat dipesan sekaligus"
                });
            }

            const booking = await Bookings.findById(booking_id);

            if (!booking) {
                return res.status(404).json({
                    message: 'Data booking tidak ditemukan'
                })
            }

            const schedule = await Schedule.getById(booking.schedule_id);

            if (!schedule) {
                return res.status(404).json({
                    message: "Jadwal tidak ditemukan"
                });
            }

            const validSeats = await Reservation.validateSeatsStudio(seat_ids, schedule.studio_id);
            if (validSeats.length !== seat_ids.length) {
                const invalidSeats = seat_ids.filter(seatId =>
                    !validSeats.some(seat => seat.id === seatId)
                );
                return res.status(400).json({
                    message: "Beberapa kursi tidak valid atau tidak tersedia di studio ini",
                    invalid_seats: invalidSeats
                });
            }

            const availability = await Reservation.checkMultipleAvailability(schedule.id, seat_ids);
            const unavailableSeats = availability.filter(seat => !seat.is_available);

            if (unavailableSeats.length > 0) {
                return res.status(400).json({
                    message: "Beberapa kursi sudah dipesan",
                    unavailable_seats: unavailableSeats.map(seat => seat.seat_id)
                });
            }

            const reservationsData = seat_ids.map(seat_id => ({
                id: uuidv4(),
                booking_id,
                seat_id,
                status: 'reserved'
            }));

            await Reservation.createBulk(reservationsData);

            const seatsDetail = validSeats.map(seat => ({
                seat_id: seat.id,
                seat_number: seat.seat_number
            }));

            res.status(201).json({
                message: `Berhasil membuat ${seat_ids.length} reservasi`,
                reservations: reservationsData.map(reservation => ({
                    id: reservation.id,
                    booking_id: reservation.booking_id,
                    seat_id: reservation.seat_id,
                    reserved_at: new Date(),
                    status: reservation.status
                })),
                seats_detail: seatsDetail,
                total_seats: seat_ids.length
            });

        } catch (error) {
            console.error("Error in createBulkReservation:", error);
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat membuat bulk reservasi"
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

    static async getBookingReservations(req, res) {
        try {
            const { bookingId } = req.params;
            const reservations = await Reservation.getByBooking(bookingId);

            res.status(200).json({
                message: "Berhasil mendapatkan reservasi pengguna",
                reservationData: reservations
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

    static async getBookedSeatsBySchedule(req, res) {
        const scheduleId = req.params.id;

        try {
            const bookedSeats = await reservationRepository.getBookedSeatsBySchedule(scheduleId);
            res.status(200).json(bookedSeats);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Gagal mengambil kursi yang telah dipesan' });
        }
    };

    static async resetReservationsBySchedule(req, res) {
        const { schedule_id } = req.params;

        try {
            const result = await Reservation.resetReservationsBySchedule(schedule_id);

            return res.status(200).json({
                message: 'Kursi pada jadwal ini berhasil direset.',
                result
            });
        } catch (error) {
            console.error('Gagal mereset kursi:', error);
            return res.status(500).json({
                message: 'Gagal mereset kursi.',
                error: error.message
            });
        }
    };
}

export default reservationController;