import reservationRepository from "../Repositories/reservationRepository.js";

class Reservation {
    constructor(id, bookingId, seatId, status = 'reserved') {
        this.id = id;
        this.booking_id = bookingId;
        this.seat_id = seatId;
        this.status = status;
    }

    static getAll() {
        return reservationRepository.getAllReservations();
    }

    static getById(id) {
        return reservationRepository.getReservationById(id);
    }

    static getByUser(userId) {
        return reservationRepository.getReservationsByUser(userId);
    }

    static updateStatus(id, status) {
        return reservationRepository.updateReservationStatus(id, status);
    }

    static checkAvailability(scheduleId, seatId) {
        return reservationRepository.checkSeatAvailability(scheduleId, seatId);
    }

    static delete(id) {
        return reservationRepository.deleteReservation(id);
    }

    static create(reservation) {
        return reservationRepository.createReservation(
            reservation.id,
            reservation.booking_id,
            reservation.seat_id
        );
    }

    static createBulk(reservationsData) {
        return reservationRepository.createBulkReservations(reservationsData);
    }

    static checkMultipleAvailability(scheduleId, seatIds) {
        return reservationRepository.checkMultipleSeatsAvailability(scheduleId, seatIds);
    }

    static validateSeatsStudio(seatIds, studioId) {
        return reservationRepository.validateSeatsStudio(seatIds, studioId);
    }
}

export default Reservation;
