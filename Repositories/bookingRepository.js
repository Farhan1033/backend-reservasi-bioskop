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

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM bookings WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                if (results.length === 0) return resolve(null); // <--- penting!
                resolve(results[0]);
            });
        });
    }

    static getAllBooking() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM bookings'
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

}