import moment from "moment";

export default class FilmModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.film_info.title;
    this.originalTitle = data.film_info.alternative_title;
    this.rating = Number(data.film_info.total_rating);
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = moment(data.film_info.release.date);
    this.runTime = data.film_info.runtime;
    this.country = data.film_info.release.release_country;
    this.genres = data.film_info.genre;
    this.description = data.film_info.description;
    this.poster = data.film_info.poster;
    this.age = Number(data.film_info.age_rating);
    this.comments = data.comments;
    this.watchedDate = moment(data.user_details.watching_date);
    this.isWatchList = Boolean(data.user_details.watchlist);
    this.isWatched = Boolean(data.user_details.already_watched);
    this.isFavorite = Boolean(data.user_details.favorite);
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "poster": this.poster,
        "director": this.director,
        "writers": this.writers,
        "release": {
          "date": this.releaseDate.toISOString(),
          "release_country": this.country,
        },
        "runtime": this.runTime,
        "actors": this.actors,
        "description": this.description,
        "total_rating": this.rating,
        "genre": this.genres,
        "age_rating": this.age,
      },
      "user_details": {
        "watchlist": this.isWatchList,
        "already_watched": this.isWatched,
        "favorite": this.isFavorite,
        "watching_date": this.watchedDate.toISOString(),
      }
    };
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  static clone(data) {
    return new FilmModel(data.toRAW());
  }
}
