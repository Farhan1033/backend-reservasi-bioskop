import express, { json } from 'express'
import helmet from 'helmet';
import cors from 'cors'
import movieRoute from "./routers/movieRoute.js"
import userRoute from './routers/userRoute.js'
import studioRoute from './routers/studioRoute.js'
import seatRoute from './routers/seatRoute.js'
import scheduleRoute from './routers/shceduleRoute.js'
import reservationRoute from './routers/reservationRoute.js'
import bookingRoute from './routers/bookingRoute.js'


const app = express();

app.use(helmet());                     // Mengatur HTTP headers yang aman
app.use(cors());                       // Mengizinkan akses dari frontend (atur asal jika perlu)
app.use(express.json());              // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded

app.use('/api/users', userRoute)
app.use('/api/movies', movieRoute)
app.use('/api/studios', studioRoute)
app.use('/api/seats', seatRoute)
app.use('/api/schedule', scheduleRoute)
app.use('/api/bookings', bookingRoute)
app.use('/api/reservation', reservationRoute)

app.listen(process.env.APP_PORT)