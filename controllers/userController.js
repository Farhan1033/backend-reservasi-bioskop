import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { secret, options } from '../config/jwtConfig.js';

class userController {
    static async register(req, res) {
        try {
            const { name, email, password, role, create_at } = req.body;

            const existingUser = await User.findByEmail(email)
            if (existingUser) {
                return res.status(400).json({ message: "Email sudah terdaftar" })
            }

            const id = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = new User(id, name, email, hashedPassword, role, create_at);

            userData.validate();

            await User.create(userData);

            res.status(201).json({
                message: "User berhasil dibuat",
                user: {
                    name,
                    email,
                    role,
                    create_at
                }
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ error: "User tidak ditemukan" })
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Password salah" });
            }

            const payload = {
                userId: user.Id,
                email: user.email,
                role: user.role
            }

            const token = jwt.sign(payload, secret, options);

            res.status(200).json({
                message: 'Login berhasil',
                token
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default userController;