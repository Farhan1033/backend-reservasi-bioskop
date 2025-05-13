import scheduleRepository from "../Repositories/scheduleRepository.js";

class Schedule {
    constructor(id, movie_id, studio_id, show_time) {
        this.id = id;
        this.movie_id = movie_id;
        this.studio_id = studio_id;
        this.show_time = show_time;
    }

    static getAll() {
        return scheduleRepository.getAllSchedules();
    }

    static getById(id) {
        return scheduleRepository.getScheduleById(id);
    }

    static getByMovie(movieId) {
        return scheduleRepository.getSchedulesByMovie(movieId);
    }

    static create(scheduleData) {
        return scheduleRepository.createSchedule(
            scheduleData.id,
            scheduleData.movie_id,
            scheduleData.studio_id,
            scheduleData.show_time
        );
    }

    static update(id, scheduleData) {
        return scheduleRepository.updateSchedule(
            id,
            scheduleData.movie_id,
            scheduleData.studio_id,
            scheduleData.show_time
        );
    }

    static delete(id) {
        return scheduleRepository.deleteSchedule(id);
    }

    static checkAvailability(studioId, showTime, duration) {
        return scheduleRepository.checkStudioAvailability(studioId, showTime, duration);
    }
}

export default Schedule;