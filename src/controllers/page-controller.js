import {FilmCard} from "../components/films-card";
import {FilmDetail} from "../components/films-detail";
import {removeComponent, render} from "../utils/render";
import {NoFilms} from "../components/no-films";
import {FilmsList} from "../components/films-list";
import {FilmsShowMore} from "../components/button-show-more";
import {FilmsListExtra} from "../components/films-list-extra";
import {getTop2FilmsByComments, getTop2FilmsByRating} from "../utils/common";
import {Sort} from "../components/sort";
import {Films} from "../components/films";

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

const renderFilmCard = (film, filmsListElement, container) => {
  const filmComponent = new FilmCard(film);
  const filmDetailComponent = new FilmDetail(film);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeFilmDetail();
    }
  };

  const bodyElement = container.tagName === `body` || container.tagName === `html` ? container : container.closest(`body`);

  const closeFilmDetail = () => {
    bodyElement.removeChild(filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const closeAllPopup = () => {
    const popupsSite = bodyElement.querySelectorAll(`.film-details`);
    if (popupsSite) {
      popupsSite.forEach((popup) => bodyElement.removeChild(popup));
    }
  };

  const showFilmDetail = () => {
    closeAllPopup();
    bodyElement.appendChild(filmDetailComponent.getElement());
    filmDetailComponent.setCloseButtonClickHandler(closeFilmDetail);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  filmComponent.setButtonOpenPopupClickHandler(showFilmDetail);
  render(filmsListElement, filmComponent);
};

export class PageController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new Sort();
    this._filmsComponent = new Films();
    this._noFilmsComponent = new NoFilms();
    this._filmsListComponent = new FilmsList();
    this._showMoreComponent = new FilmsShowMore();
    this._topRatedComponent = new FilmsListExtra(FILMS_LIST.TOP_RATING);
    this._topCommentsComponent = new FilmsListExtra(FILMS_LIST.TOP_COMMENTS);
  }

  render(films) {
    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    if (films.length === 0) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);

    let showFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    const filmListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    films.slice(0, showFilmsCount)
      .forEach((film) => renderFilmCard(film, filmListContainerElement, this._container));

    if (films.length > FILMS_LIST.CARD_COUNT_ON_START) {
      render(this._filmsListComponent.getElement(), this._showMoreComponent);

      const showMoreHandler = () => {
        const prevTasksCount = showFilmsCount;
        showFilmsCount = showFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;

        films.slice(prevTasksCount, showFilmsCount)
          .forEach((film) => renderFilmCard(film, filmListContainerElement, this._container));

        if (showFilmsCount >= films.length) {
          removeComponent(this._showMoreComponent);
        }
      };

      this._showMoreComponent.setClickHandler(showMoreHandler);
    }

    // функция рендера топ блоков с рендером карточек
    const renderTopBLock = (component, sortFunc) => {
      const siteFilmsExtraContainer = component.getElement().querySelector(`.films-list__container`);
      const topFilms = sortFunc(films);
      topFilms.forEach((film) => renderFilmCard(film, siteFilmsExtraContainer, this._container));
    };

    // рендер блоков «Top rated»
    render(this._filmsComponent.getElement(), this._topRatedComponent);
    renderTopBLock(this._topRatedComponent, getTop2FilmsByRating);

    // рендер блоков «Top Comments»
    render(this._filmsComponent.getElement(), this._topCommentsComponent);
    renderTopBLock(this._topCommentsComponent, getTop2FilmsByComments);
  }
}
