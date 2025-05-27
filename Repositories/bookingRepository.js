import db from '../config/db.js'

export default class bookingRepository {
    static createBooking(id, user_id, schedule_id, total_price) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO bookings (id, user_id, schedule_id, total_price) VALUES (?, ?, ?, ?)"
            db.query(sql, [id, user_id, schedule_id, total_price], (err, result) => {
                if (err) return reject(err);
                return resolve(result);
            })
        })
    }
}