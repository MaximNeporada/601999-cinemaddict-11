import {Films} from "../components/films";
import {FilmsList} from "../components/films-list";
import {FilmsShowMore} from "../components/button-show-more";
import {LoadingComponent} from "../components/loading";
import {MovieController} from "./movie-controller";
import {NoFilms} from "../components/no-films";
import {Sort, SortType} from "../components/sort";
import {StatisticComponent} from "../components/statistic";
import {removeComponent, render} from "../utils/render";


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
const renderFilms = (films, filmsList, onDataChange, onViewChange, api) => {
  return films.map((film) => {
    const movieController = new MovieController(filmsList, onDataChange, onViewChange, api);
    movieController.render(film);
    return movieController;
  });
};

export class PageController {
  constructor(container, moviesModel, api, siteFooterStatistics) {
    this._container = container;
    this._movieModel = moviesModel;
    this._api = api;
    this._siteFooterStatistics = siteFooterStatistics;

    this._showingFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    this._showedFilmControllers = [];

    this._statisticComponent = null;

    this._sortComponent = new Sort();
    this._filmsComponent = new Films();
    this._noFilmsComponent = new NoFilms();
    this._loadingComponent = new LoadingComponent();
    this._filmsListComponent = new FilmsList();
    this._showMoreComponent = new FilmsShowMore();

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
    removeComponent(this._showMoreComponent);
    if (FILMS_LIST.CARD_COUNT_ON_START >= this._movieModel.getMovies().length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._showMoreComponent);

    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevTasksCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;
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
    this._api.updateFilm(idData, newData)
      .then((filmModel)=> {
        const isSuccess = this._movieModel.updateMovies(idData, filmModel);
        const controllerTypes = [this._showedFilmControllers];
        if (isSuccess) {
          controllerTypes.forEach((controllerType) => this._renderControllerNewData(controllerType, idData, newData));
          this._statisticComponent.rerender(this._movieModel.getMoviesAll());
          this._checkFilterActive();
          this._siteFooterStatistics.textContent = this._movieModel.getMoviesAll().length;
        }
      });
  }

  _renderControllerNewData(controllerType, filmId, newData) {
    const currentController = controllerType.find((controller) => controller.getFilm().id === filmId);

    if (typeof currentController === `undefined`) {
      return;
    }

    currentController.render(newData);
  }

  _renderFilms(films) {
    const newFilms = renderFilms(films, this._filmListContainerElement, this._onDataChange, this._onViewChange, this._api);
    this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);
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
    this._sortComponent.setSortDefault();
    this._checkFilterActive();
    this._updateFilms(FILMS_LIST.CARD_COUNT_ON_START);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((it) => it.setDefaultView());
  }

  _checkFilterActive() {
    const filterActive = this._movieModel.getFilter();
    if (filterActive === `statistic`) {
      this._statisticComponent.show();
      this._statisticComponent.renderChart();
      this._filmsComponent.hide();
      this._sortComponent.hide();
    } else {
      this._statisticComponent.hide();
      this._filmsComponent.show();
      this._sortComponent.show();
    }
  }


  render() {
    const films = this._movieModel.getMovies();
    const allFilms = this._movieModel.getMoviesAll();

    this._statisticComponent = new StatisticComponent(allFilms);
    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    if (!films) {
      render(this._filmsComponent.getElement(), this._loadingComponent);
      this._siteFooterStatistics.textContent = ``;
      return;
    } else if (films.length === 0) {
      removeComponent(this._loadingComponent);
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      this._siteFooterStatistics.textContent = 0;
      return;
    }

    removeComponent(this._loadingComponent);
    removeComponent(this._noFilmsComponent);
    render(this._filmsComponent.getElement(), this._filmsListComponent);
    this._renderFilms(films.slice(0, this._showingFilmsCount));
    this._renderShowMoreButton();

    render(this._container, this._statisticComponent);
    this._checkFilterActive();
    this._siteFooterStatistics.textContent = allFilms.length;
  }
}
