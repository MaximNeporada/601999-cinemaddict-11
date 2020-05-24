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
  constructor(container, moviesModel) {
    this._container = container;

    this._movieModel = moviesModel;
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
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._movieModel.setFilterChangeHandler(this._onFilterChange);
  }

  _renderShowMoreButton() {
    if (FILMS_LIST.CARD_COUNT_ON_START >= this._movieModel.getMovies().length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreComponent);

    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick());
  }

  _onShowMoreButtonClick() {
    const prevTasksCount = this._showingFilmsCount;
    const films = this._movieModel.getMovies();

    const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevTasksCount, this._showingFilmsCount);
    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= films.length) {
      removeComponent(this._showMoreComponent);
    }
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    const sortedFilms = getSortedFilms(this._movieModel.getMovies(), sortType, 0, this._showingFilmsCount);


    removeComponent(this._showMoreComponent);
    this._removeFilms();
    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _onDataChange(oldData, newData) {
    const idData = oldData.id;
    const isSuccess = this._movieModel.updateMovies(idData, newData);
    const controllerTypes = [this._showedFilmControllers];
    if (isSuccess) {
      controllerTypes.forEach((controllerType) => this._renderControllerNewData(controllerType, idData, newData));
    }
  }

  _renderControllerNewData(controllerType, filmId, newData) {
    const currentController = controllerType.find((controller) => controller.getFilm().id === filmId);

    if (typeof currentController === `undefined`) {
      return;
    }

    currentController.render(newData);
  }

  _renderFilms(films) {
    const newFilms = renderFilms(films, this._filmListContainerElement, this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._showingFilmsCount = this._showedFilmControllers.length;
  }

  _removeFilms() {
    this._showedFilmControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmControllers = [];
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._movieModel.getMovies().slice(0, count));
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilms(FILMS_LIST.CARD_COUNT_ON_START);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  render() {
    const films = this._movieModel.getMovies();

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    if (films.length === 0) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);
    this._renderFilms(films.slice(0, this._showingFilmsCount));
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
