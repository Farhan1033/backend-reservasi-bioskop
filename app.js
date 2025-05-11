import express, { json } from 'express'
import helmet from 'helmet';
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import movieRoute from "./routers/movieRoute.js"
import userRoute from './routers/userRoute.js'

const app = express();
const PORT = 3000;

app.use(helmet());                     // Mengatur HTTP headers yang aman
app.use(cors());                       // Mengizinkan akses dari frontend (atur asal jika perlu)
app.use(express.json());              // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 menit
//     max: 100, // max 100 request per IP
//     message: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.'
// });

// app.use(limiter);

app.use('/api/users', userRoute)
app.use('/api', movieRoute)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})