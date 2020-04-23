import {Profile} from './components/profile.js';
import {MainNavigation} from './components/main-navigation';
import {Sort} from "./components/sort";
import {Films} from "./components/films";
import {FilmsList} from "./components/films-list";
import {FilmsListExtra} from "./components/films-list-extra";
import {FilmCard} from "./components/films-card";
import {FilmDetail} from "./components/films-detail";
import {FilmsShowMore} from "./components/button-show-more";
import {getTop2FilmsByRating, getTop2FilmsByComments} from "./utils/common";
import {render, removeComponent} from "./utils/render";

import {generateFilms} from "./mock/film-cards";
import {generateFilters} from "./mock/filter";

const FILMS_LIST = {
  CARD_COUNT: 15,
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

const films = generateFilms(FILMS_LIST.CARD_COUNT);
const filters = generateFilters(films);

const countWatched = filters.find((it) => it.id === `history`).count;

const renderFilters = (filtersObject) => {
  const filtersComponent = new MainNavigation(filtersObject);
  render(siteMainElement, filtersComponent);
};

const renderFilmCard = (filmsListElement, film) => {
  const filmComponent = new FilmCard(film);
  render(filmsListElement, filmComponent);

  // // рендер рандомной детальной карточки
// const randomFilm = films[getRandomInteger(0, films.length - 1)];
// render(siteFooterElement, createFilmDetailTemplate(randomFilm), `afterend`);
};

const renderFilms = (filmsComponentElement, filmCards) => {
  // рендер блока список фильмов
  const filmsListComponent = new FilmsList();
  render(filmsComponentElement.getElement(), filmsListComponent);

  let showFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
  const filmListContainerElement = filmsListComponent.getElement().querySelector(`.films-list__container`);
  filmCards.slice(0, showFilmsCount)
    .forEach((film) => renderFilmCard(filmListContainerElement, film));

  const showMoreComponent = new FilmsShowMore();
  render(filmsListComponent.getElement(), showMoreComponent);

  showMoreComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showFilmsCount;
    showFilmsCount = showFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;

    filmCards.slice(prevTasksCount, showFilmsCount)
      .forEach((film) => renderFilmCard(filmListContainerElement, film));

    if (showFilmsCount >= films.length) {
      removeComponent(showMoreComponent);
    }
  });

  // функция рендера топ блоков с рендером карточек
  const renderTopBLock = (component, sortFunc) => {
    const siteFilmsExtraContainer = component.getElement().querySelector(`.films-list__container`);
    const topFilms = sortFunc(filmCards);
    topFilms.forEach((film) => renderFilmCard(siteFilmsExtraContainer, film));
  };

  // рендер блоков «Top rated»
  const topRatedComponent = new FilmsListExtra(FILMS_LIST.TOP_RATING);
  render(filmsComponentElement.getElement(), topRatedComponent);
  renderTopBLock(topRatedComponent, getTop2FilmsByRating);

  // рендер блоков «Top Comments»
  const topCommentsComponent = new FilmsListExtra(FILMS_LIST.TOP_COMMENTS);
  render(filmsComponentElement.getElement(), topCommentsComponent);
  renderTopBLock(topCommentsComponent, getTop2FilmsByComments);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// рендер профиля
const profileComponent = new Profile(countWatched);
render(siteHeaderElement, profileComponent);

// рендер фильтров
renderFilters(filters);

// рендер сортировки
const sortComponent = new Sort();
render(siteMainElement, sortComponent);

// рендер секции фильмов
const filmsComponent = new Films();
render(siteMainElement, filmsComponent);

renderFilms(filmsComponent, films);

// рендер футера
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterStatistics.textContent = `${films.length}`;
