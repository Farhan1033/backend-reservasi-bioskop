import db from '../config/db.js';

export default class reservationRepository {
    static getAllReservations() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT r.*, 
                    m.title as movie_title,
                    m.poster_url as movie_poster,
                    s.show_time,
                    std.name as studio_name,
                    st.seat_number,
                    st.row as seat_row
                FROM reservations r
                JOIN bookings b ON r.booking_id = b.id
                JOIN schedules s ON b.schedule_id = s.id
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
                       st.seat_number,
                       st.row as seat_row
                FROM reservations r
                JOIN bookings b ON r.booking_id = b.id
                JOIN schedules s ON b.schedule_id = s.id
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

    static getReservationsByBooking(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    r.*, 
                    m.title AS movie_title,
                    m.id as movie_id,
                    m.poster_url,
                    s.show_time,
                    std.name AS studio_name,
                    st.seat_number,
                    st.row as seat_row
                FROM reservations r
                JOIN bookings b ON r.booking_id = b.id
                JOIN schedules s ON b.schedule_id = s.id
                JOIN movies m ON s.movie_id = m.id
                JOIN seats st ON r.seat_id = st.id
                JOIN studios std ON st.studio_id = std.id
                WHERE r.booking_id = ?
                ORDER BY s.show_time DESC;
            `;
            db.query(sql, [userId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static createReservation(id, booking_id, seatId) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO reservations (id, booking_id, seat_id, reserved_at, status)
                VALUES (?, ?, ?, ?, NOW(), 'reserved')
            `;
            db.query(sql, [id, booking_id, seatId], (err, result) => {
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
                SELECT COUNT(*) AS reserved 
                FROM reservations r
                JOIN bookings b ON r.booking_id = b.id
                WHERE b.schedule_id = ? 
                AND r.seat_id = ?
                AND r.status IN ('reserved', 'paid')
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

    static createBulkReservations(reservations) {
        return new Promise((resolve, reject) => {
            if (!reservations || reservations.length === 0) {
                return resolve([]);
            }

            const placeholders = reservations.map(() => '(?, ?, ?, NOW(), ?)').join(', ');

            const sql = `
                INSERT INTO reservations (id, booking_id, seat_id, reserved_at, status)
                VALUES ${placeholders}
            `;

            const values = reservations.flatMap(reservation => [
                reservation.id,
                reservation.booking_id,
                reservation.seat_id,
                reservation.status || 'reserved'
            ]);

            db.query(sql, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static checkMultipleSeatsAvailability(scheduleId, seatIds) {
        return new Promise((resolve, reject) => {
            if (!seatIds || seatIds.length === 0) {
                return resolve([]);
            }

            const placeholders = seatIds.map(() => '?').join(', ');
            const sql = `
                SELECT 
                    seat_id,
                    COUNT(*) as reserved_count
                FROM reservations r
                JOIN bookings b ON r.booking_id = b.id
                WHERE b.schedule_id = ? 
                AND seat_id IN (${placeholders})
                AND status IN ('reserved', 'paid')
                GROUP BY seat_id
            `;

            db.query(sql, [scheduleId, ...seatIds], (err, result) => {
                if (err) return reject(err);

                const reservedSeats = new Set(result.map(row => row.seat_id));
                const availability = seatIds.map(seatId => ({
                    seat_id: seatId,
                    is_available: !reservedSeats.has(seatId)
                }));

                resolve(availability);
            });
        });
    }

    static validateSeatsStudio(seatIds, studioId) {
        return new Promise((resolve, reject) => {
            if (!seatIds || seatIds.length === 0) {
                return resolve([]);
            }

            const placeholders = seatIds.map(() => '?').join(', ');
            const sql = `
                SELECT id, studio_id, seat_number, row as seat_row
                FROM seats 
                WHERE id IN (${placeholders}) AND studio_id = ?
            `;

            db.query(sql, [...seatIds, studioId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}