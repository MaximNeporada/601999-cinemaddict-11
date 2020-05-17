import {FilmCard} from "../components/films-card";
import {FilmDetail} from "../components/films-detail";
import {removeComponent, render} from "../utils/render";
import {NoFilms} from "../components/no-films";
import {FilmsList} from "../components/films-list";
import {FilmsShowMore} from "../components/button-show-more";
import {FilmsListExtra} from "../components/films-list-extra";
import {getTop2FilmsByComments, getTop2FilmsByRating} from "../utils/common";
import {Sort, SortType} from "../components/sort";
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

const renderFilmCard = (film, filmsListElement) => {
  const filmComponent = new FilmCard(film);
  const filmDetailComponent = new FilmDetail(film);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closeFilmDetail();
    }
  };

  const bodyElement =  filmsListElement.closest(`body`);

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
const renderFilms = (films, filmsList) => {
  films.forEach((film) => {
    renderFilmCard(film, filmsList);
  });
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
    // функция рендера кнопки "ПОКАЗАТЬ ЕЩЕ" и логика отрисовки карточек при клике
    const renderShowMoreButton = () => {
      if (FILMS_LIST.CARD_COUNT_ON_START >= films.length) {
        return;
      }

      render(this._filmsListComponent.getElement(), this._showMoreComponent);

      const showMoreHandler = () => {
        const prevTasksCount = showFilmsCount;
        showFilmsCount = showFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;

        const sortedFilms = getSortedFilms(films, this._sortComponent.getSortType(), prevTasksCount, showFilmsCount);

        renderFilms(sortedFilms, filmListContainerElement);

        if (showFilmsCount >= films.length) {
          removeComponent(this._showMoreComponent);
        }
      };

      this._showMoreComponent.setClickHandler(showMoreHandler);
    };

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);

    if (films.length === 0) {
      render(this._filmsComponent.getElement(), this._noFilmsComponent);
      return;
    }

    render(this._filmsComponent.getElement(), this._filmsListComponent);

    let showFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
    const filmListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    renderFilms(films.slice(0, showFilmsCount), filmListContainerElement);

    renderShowMoreButton();

    // сортировка карточек
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showFilmsCount = FILMS_LIST.SHOWING_COUNT_BY_BUTTON;
      const sortedFilms = getSortedFilms(films, sortType, 0, showFilmsCount);

      filmListContainerElement.innerHTML = ``;
      removeComponent(this._showMoreComponent);

      renderFilms(sortedFilms, filmListContainerElement);

      renderShowMoreButton();
    });

    // функция рендера топ блоков с рендером карточек
    const renderTopBLock = (component, sortFunc) => {
      const siteFilmsExtraContainer = component.getElement().querySelector(`.films-list__container`);
      const topFilms = sortFunc(films);

      renderFilms(topFilms, siteFilmsExtraContainer);
    };

    // рендер блоков «Top rated»
    render(this._filmsComponent.getElement(), this._topRatedComponent);
    renderTopBLock(this._topRatedComponent, getTop2FilmsByRating);

    // рендер блоков «Top Comments»
    render(this._filmsComponent.getElement(), this._topCommentsComponent);
    renderTopBLock(this._topCommentsComponent, getTop2FilmsByComments);
  }
}
