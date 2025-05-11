import db from '../config/db.js'

export default class movieRepository {
    static getAllMovies() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM movies"
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                resolve(result);
            })
        })
    }

    static searchMovies(title) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM movies WHERE title LIKE ?"
            db.query(sql, [`%${title}%`], (err, result) => {
                if (err) return reject(err)
                resolve(result);
            })
        })
    }

    static createMovies(id, title, description, duration, poster_url) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO movies (id, title, description, duration, poster_url) VALUES (?, ?, ?, ?, ?)"
            db.query(sql, [id, title, description, duration, poster_url], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    static updateMovies(id, title, description, duration, poster_url) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE movies SET title = ?, description = ?, duration = ?, poster_url = ? WHERE id = ?"
            db.query(sql, [title, description, duration, poster_url, id], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    static deleteMovies(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM movies WHERE id = ?"
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err)
                resolve(result[0])
            })
        })
    }
}