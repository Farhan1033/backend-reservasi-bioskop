import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;
const options = {
    expiresIn: '24h'
};

export { secret, options };