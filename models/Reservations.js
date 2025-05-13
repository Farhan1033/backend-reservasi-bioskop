import reservationRepository from "../Repositories/reservationRepository.js";

class Reservation {
    constructor(id, user_id, schedule_id, seat_id, reserved_at, status = 'reserved') {
        this.id = id;
        this.user_id = user_id;
        this.schedule_id = schedule_id;
        this.seat_id = seat_id;
        this.reserved_at = reserved_at;
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

    static create(reservationData) {
        return reservationRepository.createReservation(
            reservationData.id,
            reservationData.user_id,
            reservationData.schedule_id,
            reservationData.seat_id
        );
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
}

export default Reservation;