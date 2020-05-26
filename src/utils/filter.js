import {FilterType} from "../const";

export const getWatchListFilms = (films) => {
  console.log(films.filter((film) => film.isWatchList));
  return films.filter((film) => film.isWatchList);
};
export const getWatchedFilms = (films) => {
  console.log(films.filter((film) => film.isWatched));
  return films.filter((film) => film.isWatched);
};
export const getFavoriteFilms = (films) => {
  console.log(films.filter((film) => film.isFavorite));
  return films.filter((film) => film.isFavorite);
};

export const getTasksByFilter = (films, filterType) => {
  console.log(filterType);
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
