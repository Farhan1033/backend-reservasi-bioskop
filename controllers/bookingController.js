import { v4 as uuidv4 } from "uuid";
import Bookings from "../models/Bookings";

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
                movie: bookingData
            });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                details: "Terjadi kesalahan saat menambahkan data booking"
            });
        }
    }
}