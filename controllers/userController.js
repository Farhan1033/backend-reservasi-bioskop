import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import User from '../models/User.js';

class userController {
    static async register(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const existingUser = await User.findByEmail(email)
            if (existingUser) {
                return res.status(400).json({ message: "Email sudah terdaftar" })
            }

            const id = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 10);

            const userData = new User(id, name, email, hashedPassword, role);

            userData.validate();

            await User.create(userData);

            res.status(201).json({
                message: "User berhasil dibuat",
                user: {
                    name,
                    email,
                    role
                }
            })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

export default userController;