import movieRepository from "../Repositories/movieRepository.js";

class Movies {
    constructor(id, title, description, duration, poster_url, created_at) {
        this.id = id,
            this.title = title,
            this.description = description,
            this.duration = duration,
            this.poster_url = poster_url,
            this.created_at = created_at
    }

    static getAll() {
        return movieRepository.getAllMovies()
    }

    static findByTitle(title) {
        return movieRepository.searchMovies(title)
    }

    static deleteMovie(id) {
        return movieRepository.deleteMovies(id)
    }

    static createMovies(filmData) {
        return movieRepository.createMovies(
            filmData.id,
            filmData.title,
            filmData.description,
            filmData.duration,
            filmData.poster_url,
            filmData.created_at
        )
    }

    static updateMovies(filmData) {
        return movieRepository.updateMovies(
            filmData.id,
            filmData.title,
            filmData.description,
            filmData.duration,
            filmData.poster_url
        )
    }
}

export default Movies;