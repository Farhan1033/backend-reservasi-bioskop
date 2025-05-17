import db from '../config/db.js';

export default class scheduleRepository {
    static getAllSchedules() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, m.title as movie_title, m.poster_url as movie_poster, st.name as studio_name 
                FROM schedules s
                JOIN movies m ON s.movie_id = m.id
                JOIN studios st ON s.studio_id = st.id
            `;
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static getScheduleById(id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, m.title as movie_title, m.poster_url as movie_poster, st.name as studio_name 
                FROM schedules s
                JOIN movies m ON s.movie_id = m.id
                JOIN studios st ON s.studio_id = st.id
                WHERE s.id = ?
            `;
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static getSchedulesByMovie(movieId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT s.*, st.name as studio_name, st.seat_capacity
                FROM schedules s
                JOIN studios st ON s.studio_id = st.id
                WHERE s.movie_id = ?
                ORDER BY s.show_time
            `;
            db.query(sql, [movieId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static createSchedule(id, movieId, studioId, showTime) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO schedules (id, movie_id, studio_id, show_time)
                VALUES (?, ?, ?, ?)
            `;
            db.query(sql, [id, movieId, studioId, showTime], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static updateSchedule(id, movieId, studioId, showTime) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE schedules 
                SET movie_id = ?, studio_id = ?, show_time = ?
                WHERE id = ?
            `;
            db.query(sql, [movieId, studioId, showTime, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static deleteSchedule(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM schedules WHERE id = ?";
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static checkStudioAvailability(studioId, showTime, duration) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT COUNT(*) as conflict_count 
                FROM schedules s
                JOIN movies m ON s.movie_id = m.id
                WHERE s.studio_id = ?
                AND (
                    (s.show_time <= ? AND DATE_ADD(s.show_time, INTERVAL m.duration MINUTE) > ?)
                    OR (s.show_time < DATE_ADD(?, INTERVAL ? MINUTE) AND DATE_ADD(s.show_time, INTERVAL m.duration MINUTE) >= ?)
                    OR (s.show_time >= ? AND s.show_time < DATE_ADD(?, INTERVAL ? MINUTE))
                )
            `;
            db.query(sql, [
                studioId,
                showTime, showTime,
                showTime, duration, showTime,
                showTime, showTime, duration
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].conflict_count > 0);
            });
        });
    }
}