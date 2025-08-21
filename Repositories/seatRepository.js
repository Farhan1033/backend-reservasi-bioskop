import db from '../config/db.js';

export default class seatRepository {
    static getAllSeats() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM seats";
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getSeatsByStudio(studioId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM seats WHERE studio_id = ? ORDER BY `row`, seat_number";
            db.query(sql, [studioId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getSeatById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM seats WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]); // Mengembalikan satu record saja
            });
        });
    }


    static getAvailableSeats(scheduleId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.* FROM seats s
                WHERE s.studio_id = (SELECT studio_id FROM schedules WHERE id = ?)
                AND s.is_active = true
                AND s.id NOT IN (
                    SELECT seat_id FROM reservations 
                    WHERE schedule_id = ? 
                    AND status IN ('reserved', 'paid')
                )
                ORDER BY s.`row`, s.seat_number
            `;
            db.query(sql, [scheduleId, scheduleId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static createSeat(id, studioId, seatNumber, row = 'A', type = 'regular') {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO seats (id, studio_id, seat_number, `row`, type, is_active)
                VALUES (?, ?, ?, ?, ?, true)
            `;
            db.query(sql, [id, studioId, seatNumber, row, type], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static bulkCreateSeats(seatsData) {
        return new Promise((resolve, reject) => {
            if (!seatsData || seatsData.length === 0) {
                return reject(new Error('No seats data provided'));
            }

            const values = seatsData.map(seat =>
                [seat.id, seat.studio_id, seat.seat_number, seat.row || 'A', seat.type || 'regular', seat.is_active || true]
            );

            const sql = `
                INSERT INTO seats (id, studio_id, seat_number, `row`, type, is_active)
                VALUES ?
            `;

            db.query(sql, [values], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static updateSeat(id, seatData) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE seats 
                SET seat_number = ?, `row` = ?, type = ?, is_active = ?
                WHERE id = ?
            `;
            db.query(sql, [
                seatData.seat_number,
                seatData.row,
                seatData.type,
                seatData.is_active,
                id
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static deactivateSeats(seatIds) {
        return new Promise((resolve, reject) => {
            const placeholders = seatIds.map(() => '?').join(',');
            const sql = `UPDATE seats SET is_active = false WHERE id IN (${placeholders})`;
            db.query(sql, seatIds, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static actavateSeats(studioId) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE seats SET is_active = true WHERE studio_id = ?'
            db.query(sql, [studioId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    }

    static deleteSeat(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM seats WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static countByStudio(studioId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT COUNT(*) AS total FROM seats WHERE studio_id = ?";
            db.query(sql, [studioId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].total);
            });
        });
    }
}
