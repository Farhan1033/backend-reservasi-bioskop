import { v4 as uuidv4 } from "uuid";
import Bookings from "../models/Bookings.js";

export default class bookingController {
    static async addBooking(req, res) {
        try {
            const { user_id, schedule_id, total_price } = req.body;

            if (!user_id || !schedule_id || !total_price) {
                return res.status(400).json({
                    error: 'Semua field harus diisi'
                })
            }

            const id = uuidv4();
            const booked_at = new Date();

            const bookingData = new Bookings(
                id,
                user_id,
                schedule_id,
                total_price,
                booked_at
            );

            await Bookings.createBooking(bookingData);

            res.status(200).json({
                message: "Booking berhasil ditambahkan",
                bookings: bookingData
            });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat menambahkan data booking"
            });
        }
    }

    static async findById(req, res) {
        try {
            const { id } = req.params;

            const bookingDataId = await Bookings.findById(id);

            res.status(200).json({
                message: 'Berhasil mendapatkan data booking',
                booking: bookingDataId
            })
        } catch (error) {
            req.status(500).json({
                message: 'Gagal mendapatkan data booking',
                error: error.message
            })
        }
    }

    static async getAll(req, res) {
        try {
            const bookingData = await Bookings.getAllData();

            res.status(200).json({
                message: 'Berhasil mendapatkan semua data',
                booking: bookingData
            })
        } catch (error) {
            res.status(500).json({
                error: error.message,
                message: 'Terjadi kesalahan saat mengambil data'
            })
        }
    }
}