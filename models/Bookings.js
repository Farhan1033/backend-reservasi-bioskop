import bookingRepository from "../Repositories/bookingRepository.js"

export default class Bookings {
    constructor(id, user_id, schedule_id, total_price) {
        this.id = id,
            this.user_id = user_id,
            this.schedule_id = schedule_id,
            this.total_price = total_price
    }

    static createBooking(bookingData) {
        return bookingRepository.createBooking(
            bookingData.id,
            bookingData.user_id,
            bookingData.schedule_id,
            bookingData.total_price
        )
    }

    static findById(id) {
        return bookingRepository.findById(id);
    }

    static getAllData() {
        return bookingRepository.getAllBooking();
    }
}