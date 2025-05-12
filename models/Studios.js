import studioRepository from "../Repositories/studioRepository.js";

class Studios {
    constructor(id, name, seat_capacity) {
        this.id = id,
            this.name = name,
            this.seat_capacity = seat_capacity
    }

    static getAllStudios() {
        return studioRepository.getAllStudio();
    }

    static createStudios(studioData) {
        return studioRepository.addStudio(
            studioData.id,
            studioData.name,
            studioData.seat_capacity
        );
    }

    static updateStudios(studioData) {
        return studioRepository.updateStudio(
            studioData.id,
            studioData.name,
            studioData.seat_capacity
        );
    }

    static deleteStudios(id) {
        return studioRepository.deleteStudio(id);
    }
}

export default Studios;