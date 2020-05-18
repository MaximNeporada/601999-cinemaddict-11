import {Films} from "../components/films";
import {FilmsList} from "../components/films-list";
import {NoFilms} from "../components/no-films";

import {Sort, SortType} from "../components/sort";

import {FilmsShowMore} from "../components/button-show-more";
import {FilmsListExtra} from "../components/films-list-extra";
import {removeComponent, render} from "../utils/render";
import {getTop2FilmsByComments, getTop2FilmsByRating} from "../utils/common";
import {MovieController} from "./movie-controller";


const FILMS_LIST = {
  CARD_COUNT_ON_START: 5,
  SHOWING_COUNT_BY_BUTTON: 5,
  TOP_RATING: {
    title: `Top rated`,
    id: `top-rating`
  },
  TOP_COMMENTS: {
    title: `Most commented`,
    id: `top-comments`,
  },
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.RATING_DOWN:
      sortedFilms = showingFilms.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      break;
    case SortType.DATE_DOWN:
      sortedFilms = showingFilms.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

// рендер карточек фильмов, films= массив фильмов, filmList = блок куда вставляем карточки
const renderFilms = (films, filmsList, onDataChange, onViewChange) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsList, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};

export class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._showingFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    this._showedFilmControllers = [];

    this._sortComponent = new Sort();
    this._filmsComponent = new Films();
    this._noFilmsComponent = new NoFilms();
    this._filmsListComponent = new FilmsList();
    this._showMoreComponent = new FilmsShowMore();
    this._topRatedComponent = new FilmsListExtra(FILMS_LIST.TOP_RATING);
    this._topCommentsComponent = new FilmsListExtra(FILMS_LIST.TOP_COMMENTS);

    this._filmListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderShowMoreButton() {
    if (FILMS_LIST.CARD_COUNT_ON_START >= this._films.length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreComponent);

    const showMoreHandler = () => {
      const prevTasksCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._films, this._sortComponent.getSortType(), prevTasksCount, this._showingFilmsCount);

      const newFilms = renderFilms(sortedFilms, this._filmListContainerElement, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= this._films.length) {
        removeComponent(this._showMoreComponent);
      }
    };

    this._showMoreComponent.setClickHandler(showMoreHandler);
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    const sortedFilms = getSortedFilms(this._films, sortType, 0, this._showingFilmsCount);

    this._filmListContainerElement.innerHTML = ``;
    removeComponent(this._showMoreComponent);

    const newFilms = renderFilms(sortedFilms, this._filmListContainerElement, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;

    this._renderShowMoreButton();
  }

  _onDataChange(filmController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    filmController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  render(films) {
    this._films = films;

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    if (films.length === 0) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);

    let showFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;

    const newFilms = renderFilms(films.slice(0, showFilmsCount), this._filmListContainerElement, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

    this._renderShowMoreButton();

    // функция рендера топ блоков с рендером карточек
    const renderTopBLock = (component, sortFunc) => {
      const siteFilmsExtraContainer = component.getElement().querySelector(`.films-list__container`);
      const topFilms = sortFunc(films);

      renderFilms(topFilms, siteFilmsExtraContainer, this._onDataChange, this._onViewChange);
    };

    // рендер блоков «Top rated»
    render(this._filmsComponent.getElement(), this._topRatedComponent);
    renderTopBLock(this._topRatedComponent, getTop2FilmsByRating);

    // рендер блоков «Top Comments»
    render(this._filmsComponent.getElement(), this._topCommentsComponent);
    renderTopBLock(this._topCommentsComponent, getTop2FilmsByComments);
  }
}
