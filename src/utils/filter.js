import {FilterType} from "../const";

export const getWatchListFilms = (films) => {
  return films.filter((film) => film.isWatchList);
};
export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};
export const getFavoriteFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

export const getTasksByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getWatchListFilms(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.FAVORITE:
      return getFavoriteFilms(films);
    case FilterType.STATS:
      return films;
  }

  return films;
};
