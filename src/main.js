import {createProfileTemplate} from './components/profile.js';
import {createMainNavigationTemplate} from './components/main-navigation';
import {createSortTemplate} from "./components/sort";
import {createFilmsTemplate} from "./components/films";
import {createFilmsListTemplate} from "./components/films-list";
import {createFilmsCardTemplate} from "./components/films-card";
import {createFilmsShowMoreTemplates} from "./components/button-show-more";
import {createFilmsListExtra} from "./components/films-list-extra";
import {createFilmDetailTemplate} from "./components/films-detail";
import {getMaxNumberOfKey, getRandomInteger} from "./utils";

import {generateFilms} from "./mock/film-cards";
import {generateFilters} from "./mock/filter";

const FILMS_LIST = {
  CARD_COUNT: 15,
  CARD_COUNT_ON_START: 5,
  SHOWING_COUNT_BY_BUTTON: 5,
  EXTRA_CARDS_COUNT: 2,
  EXTRA: [
    {
      title: `Top rated`,
      cardCount: 2,
      keyFind: `rating`
    },
    {
      title: `Most commented`,
      cardCount: 2,
      keyFind: `comments`
    },
  ],

};

const films = generateFilms(FILMS_LIST.CARD_COUNT);
const filters = generateFilters(films);

const countWathced = filters.find((it) => it.id === `history`).count;

// функция для рендеринга
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

// рендер профиля
render(siteHeaderElement, createProfileTemplate(countWathced));

// рендер фильтров
render(siteMainElement, createMainNavigationTemplate(filters));

// рендер сортировки
render(siteMainElement, createSortTemplate());

// рендер секции фильмов
render(siteMainElement, createFilmsTemplate());

const siteFilmsElement = siteMainElement.querySelector(`.films`);

// рендер блока список фильмов
render(siteFilmsElement, createFilmsListTemplate());

const siteFilmsListElement = siteFilmsElement.querySelector(`.films-list`);
const siteFilmsListContainerElement = siteFilmsElement.querySelector(`.films-list__container`);

// рендер карточек фильмов
let showFilmsCount = FILMS_LIST.CARD_COUNT_ON_START;
films.slice(0, showFilmsCount).forEach((film) => render(siteFilmsListContainerElement, createFilmsCardTemplate(film)));

// рендер и создание события кнопки SHOW MORE
render(siteFilmsListElement, createFilmsShowMoreTemplates());

const loadMoreButton = siteFilmsListElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showFilmsCount;
  showFilmsCount = showFilmsCount + FILMS_LIST.SHOWING_COUNT_BY_BUTTON;

  films.slice(prevTasksCount, showFilmsCount)
    .forEach((film) => render(siteFilmsListContainerElement, createFilmsCardTemplate(film)));

  if (showFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

// // рендер блоков «Top rated» и «Most commented»
FILMS_LIST.EXTRA.forEach((item, index) => {
  render(siteFilmsElement, createFilmsListExtra(item));

  const siteFilmsExtraItem = siteFilmsElement.querySelectorAll(`.films-list--extra`);
  const filmsExtraContainerElement = siteFilmsExtraItem[index].querySelector(`.films-list__container`);
  const mostFilms = getMaxNumberOfKey(films, item.keyFind, item.cardCount);

  mostFilms.forEach((film) => {
    render(filmsExtraContainerElement, createFilmsCardTemplate(film));
  });
});

// рендер футера
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatisticks = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterStatisticks.textContent = `${films.length}`;

// рендер рандомной детальной карточки
const randomFilm = films[getRandomInteger(0, films.length - 1)];
render(siteFooterElement, createFilmDetailTemplate(randomFilm), `afterend`);
