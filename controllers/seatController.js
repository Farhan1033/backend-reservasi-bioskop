import { v4 as uuidv4 } from 'uuid';
import Seat from '../models/Seats.js';
import Studios from '../models/Studios.js';

class seatController {
    static async createSeat(req, res) {
        try {
            const { studio_id, seat_number, row, type } = req.body;

            if (!studio_id || !seat_number) {
                return res.status(400).json({
                    message: "studio_id dan seat_number harus diisi"
                });
            }

            // Cek apakah seat_number sudah ada di studio tersebut
            const existingSeats = await Seat.getByStudio(studio_id);
            const seatExists = existingSeats.some(seat =>
                seat.seat_number === seat_number && seat.row === (row || 'A')
            );

            if (seatExists) {
                return res.status(400).json({
                    message: "Kursi dengan nomor tersebut sudah ada di studio ini"
                });
            }

            const id = uuidv4();
            const seatData = new Seat(id, studio_id, seat_number, row, type);

            await Seat.create(seatData);

            res.status(201).json({
                message: "Kursi berhasil ditambahkan",
                seat: seatData
            });
        } catch (error) {
            console.error("Error in createSeat:", error);
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat menambahkan kursi"
            });
        }
    }

    static async createBulkSeats(req, res) {
        try {
            const { studio_id, seats } = req.body;

            if (!studio_id || !seats || seats.length === 0) {
                return res.status(400).json({
                    message: "studio_id dan seats data harus diisi"
                });
            }

            const studioResult = await Studios.findByPK(studio_id);
            if (!studioResult || studioResult.length === 0) {
                return res.status(404).json({ message: "Studio tidak ditemukan" });
            }

            const studio = studioResult[0];

            const existingSeatCount = await Seat.countByStudio(studio_id);

            if (existingSeatCount + seats.length > studio.seat_capacity) {
                const sisa = studio.seat_capacity - existingSeatCount;
                return res.status(400).json({
                    message: `Kapasitas studio sudah penuh. Maksimum hanya bisa menambahkan ${sisa < 0 ? 0 : sisa} kursi lagi.`,
                    current_seats: existingSeatCount,
                    capacity: studio.seat_capacity,
                    requested: seats.length,
                    available_slots: sisa < 0 ? 0 : sisa
                });
            }

            const seatNumbers = seats.map(seat => seat.seat_number);
            const uniqueSeatNumbers = [...new Set(seatNumbers)];

            if (seatNumbers.length !== uniqueSeatNumbers.length) {
                return res.status(400).json({
                    message: "Terdapat duplikasi nomor kursi dalam data yang dikirim"
                });
            }

            const existingSeats = await seatRepository.getSeatsByStudio(studio_id);
            const existingSeatNumbers = existingSeats.map(seat => seat.seat_number);
            const duplicates = seatNumbers.filter(num => existingSeatNumbers.includes(num));

            if (duplicates.length > 0) {
                return res.status(400).json({
                    message: `Nomor kursi sudah ada di studio ini: ${duplicates.join(', ')}`
                });
            }

            const seatsData = seats.map(seat => ({
                id: uuidv4(),
                studio_id,
                seat_number: seat.seat_number,
                row: seat.row || 'A',
                type: seat.type || 'regular',
                is_active: seat.is_active !== false
            }));

            await seatRepository.bulkCreateSeats(seatsData);

            res.status(201).json({
                message: "Kursi berhasil ditambahkan secara masal",
                count: seatsData.length,
                studio_capacity: studio.seat_capacity,
                total_seats_after: existingSeatCount + seatsData.length,
                remaining_capacity: studio.seat_capacity - (existingSeatCount + seatsData.length)
            });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    message: "Terdapat duplikasi data kursi",
                    details: "Nomor kursi atau ID kursi sudah ada di database"
                });
            }

            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({
                    message: "Studio ID tidak valid",
                    details: "Studio yang direferensikan tidak ditemukan"
                });
            }

            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat menambahkan kursi secara massal"
            });
        }
    }



    static async getSeatsByStudio(req, res) {
        try {
            const { studioId } = req.params;

            const seats = await Seat.getByStudio(studioId);

            res.status(200).json({
                message: "Berhasil mendapatkan data kursi",
                seats: seats
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mendapatkan data kursi",
                error: error.message
            });
        }
    }

    static async getAvailableSeats(req, res) {
        try {
            const { scheduleId } = req.params;

            const seats = await Seat.getAvailable(scheduleId);

            res.status(200).json({
                message: "Berhasil mendapatkan kursi yang tersedia",
                available_seats: seats
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mendapatkan kursi yang tersedia",
                error: error.message
            });
        }
    }

    static async updateSeat(req, res) {
        try {
            const { id, seat_number, row, type, is_active } = req.body;

            if (!id) {
                return res.status(400).json({ message: "ID kursi harus diisi" });
            }

            const seatData = {
                seat_number,
                row,
                type,
                is_active
            };

            const result = await Seat.update(id, seatData);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Kursi tidak ditemukan atau tidak ada perubahan"
                });
            }

            res.status(200).json({
                message: "Kursi berhasil diupdate",
                seat: {
                    id,
                    ...seatData
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deactivateSeat(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID kursi harus diisi" });
            }

            const result = await Seat.deactivate(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Kursi tidak ditemukan" });
            }

            res.status(200).json({
                message: "Kursi berhasil dinonaktifkan"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteSeat(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "ID kursi harus diisi" });
            }

            await Seat.delete(id);

            res.status(200).json({
                message: "Kursi berhasil dihapus"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default seatController;