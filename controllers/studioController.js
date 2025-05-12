import Studios from "../models/Studios.js";
import { v4 as uuidv4 } from "uuid";

export default class studioController {
    static async addStudio(req, res) {
        try {
            const { name, seat_capacity } = req.body

            if (!name || !seat_capacity) {
                return res.status(400).json({
                    message: "Semua filed harus diisi"
                })
            }

            const id = uuidv4();

            const studioData = new Studios(id, name, seat_capacity)

            await Studios.createStudios(studioData)

            res.status(200).json({
                message: "Studio Berhasil Ditambahkan",
                studio: {
                    studioData
                }
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async getAllStudio(req, res) {
        try {
            const studioData = await Studios.getAllStudios();

            res.status(200).json({
                message: "Berhasil menampilkan data studio",
                studio: studioData
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async updateStudio(req, res) {
        try {
            const { id, name, seat_capacity } = req.body;

            if (!id) return res.status(400).json({ message: "Studio tidak ditemukan" })

            const studioData = new Studios(id, name, seat_capacity)

            const result = await Studios.updateStudios(studioData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Data studio gagal diupdate ID tidak ditemukan" })
            }

            res.status(200).json({
                message: "Data berhasil diupdate",
                studio: {
                    name,
                    seat_capacity
                }
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async deleteStudio(req, res) {
        try {
            const { id } = req.body

            if (!id) return res.status(400).json({ message: "Studio tidak ditemukan" })

            await Studios.deleteStudios(id);

            res.status(200).json({
                message: "Data berhasil dihapus"
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}