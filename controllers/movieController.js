import db from '../config/db.js'

export const getAllMovies = (req, res) => {
    db.query('SELECT * FROM movies', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result)
    })
}

export const addMovies = (req, res) => {
    const { title, description, duration } = req.body
    const sql = "INSERT INTO movies (title, description, duration) VALUES (?, ?, ?)"
    db.query(sql, [title, description, duration], (err, result) => {
        if (err) return res.status(500).send(err)
        res.status(200).json({ message: 'Film berhasil ditambahkan', id: result.insertId })
    })
}

export const editMovies = (req, res) => {
    const { id } = req.params
    const { title, description, duration } = req.body
    const sql = "UPDATE movies SET title = ?, description = ?, duration = ? WHERE id = ?"
    db.query(sql, [title, description, duration, id], (err, result) => {
        if (err) return res.status(404).send(err)
        res.status(200).json({ message: "Film berhasil diupdate" })
    })
}

export const deleteMovies = (req, res) => {
    const { id } = req.params
    const sql = "DELETE FROM movies WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(404).json({message : "Silahkan masukkan id film dengan benar"})
        res.status(200).json({message : "Film berhasil dihapus"})
    })
}