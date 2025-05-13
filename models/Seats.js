import seatRepository from "../Repositories/seatRepository.js";

class Seat {
    constructor(id, studio_id, seat_number, row = 'A', type = 'regular', is_active = true) {
        this.id = id;
        this.studio_id = studio_id;
        this.seat_number = seat_number;
        this.row = row;
        this.type = type;
        this.is_active = is_active;
    }

    static getAll() {
        return seatRepository.getAllSeats();
    }

    static getByStudio(studioId) {
        return seatRepository.getSeatsByStudio(studioId);
    }

    static getAvailable(scheduleId) {
        return seatRepository.getAvailableSeats(scheduleId);
    }

    static create(seatData) {
        return seatRepository.createSeat(
            seatData.id,
            seatData.studio_id,
            seatData.seat_number,
            seatData.row,
            seatData.type
        );
    }

    static bulkCreate(seatsData) {
        return seatRepository.bulkCreateSeats(seatsData);
    }

    static update(id, seatData) {
        return seatRepository.updateSeat(id, seatData);
    }

    static deactivate(id) {
        return seatRepository.deactivateSeat(id);
    }

    static delete(id) {
        return seatRepository.deleteSeat(id);
    }

    static getById(id) {
        return seatRepository.getSeatById(id);
    }

}

export default Seat;