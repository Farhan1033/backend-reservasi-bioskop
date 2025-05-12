import db from "../config/db.js";

export default class studioRepository {
    static async getAllStudio() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM studios"
            db.query(sql, (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    static async addStudio(id, name, seat_capacity) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO studios (id, name, seat_capacity) VALUES (?, ?, ?, ?)"
            db.query(sql, [id, name, seat_capacity], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    static async updateStudio(id, name, seat_capacity) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE studios SET name = ?, seat_capacity = ? WHERE id = ?"
            db.query(sql, [name, seat_capacity, id], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    static async deleteStudio(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM studios WHERE id = ?"
            db.query(sql, [id], (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }
}