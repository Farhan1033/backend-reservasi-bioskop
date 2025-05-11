import db from '../config/db.js'

export default class UserRepository {
    static createUser(id, name, email, password, role) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
            db.query(sql, [id, name, email, password, role], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ?";
            db.query(sql, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE id = ?";
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}
