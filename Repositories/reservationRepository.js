import db from '../config/db.js';

export default class reservationRepository {
    static getAllReservations() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, 
                       m.title as movie_title,
                       s.show_time,
                       std.name as studio_name,
                       st.seat_number
                FROM reservations r
                JOIN schedules s ON r.schedule_id = s.id
                JOIN movies m ON s.movie_id = m.id
                JOIN seats st ON r.seat_id = st.id
                JOIN studios std ON st.studio_id = std.id
            `;
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getReservationById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, 
                       m.title as movie_title,
                       s.show_time,
                       std.name as studio_name,
                       st.seat_number
                FROM reservations r
                JOIN schedules s ON r.schedule_id = s.id
                JOIN movies m ON s.movie_id = m.id
                JOIN seats st ON r.seat_id = st.id
                JOIN studios std ON st.studio_id = std.id
                WHERE r.id = ?
            `;
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static getReservationsByUser(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    r.*, 
                    m.title AS movie_title,
                    m.poster_url,
                    s.show_time,
                    std.name AS studio_name,
                    st.seat_number
                FROM reservations r
                JOIN schedules s ON r.schedule_id = s.id
                JOIN movies m ON s.movie_id = m.id
                JOIN seats st ON r.seat_id = st.id
                JOIN studios std ON st.studio_id = std.id
                WHERE r.user_id = ?
                ORDER BY s.show_time DESC;
            `;
            db.query(sql, [userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static createReservation(id, userId, scheduleId, seatId) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO reservations (id, user_id, schedule_id, seat_id, reserved_at, status)
                VALUES (?, ?, ?, ?, NOW(), 'reserved')
            `;
            db.query(sql, [id, userId, scheduleId, seatId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static updateReservationStatus(id, status) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE reservations SET status = ? WHERE id = ?";
            db.query(sql, [status, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static checkSeatAvailability(scheduleId, seatId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT COUNT(*) as reserved 
                FROM reservations 
                WHERE schedule_id = ? 
                AND seat_id = ?
                AND status IN ('reserved', 'paid')
            `;
            db.query(sql, [scheduleId, seatId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].reserved === 0);
            });
        });
    }

    static deleteReservation(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM reservations WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}