import {createProfileTemplate} from 'components/profile';
import {createMainNavigationTemplate} from 'components/main-navigation';
import {createSortTemplate} from "./components/srot";
import {createFilmsTemplate} from "./components/films";
import {createFilmsListTemplate} from "./components/films-list";
import {createFilmsCardTemplate} from "./components/films-card";
import {createFilmsShowMoreTemplates} from "./components/button-show-more";
import {createFilmsListExtra} from "./components/films-list-extra";
import {createFilmDetailTemplate} from "./components/films-detail";

const FILMS_LIST = {
  CARD_COUNT: 5,
  EXTRA_CARDS_COUNT: 2,
  EXTRA_TITLES: [`Top rated`, `Most commented`]
};

// функция для рендеринга
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createSortTemplate());
render(siteMainElement, createFilmsTemplate());

const siteFilmsElement = siteMainElement.querySelector(`.films`);

render(siteFilmsElement, createFilmsListTemplate());

const siteFilmsListElement = siteFilmsElement.querySelector(`.films-list`);
const siteFilmsListContainerElement = siteFilmsElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_LIST.CARD_COUNT; i++) {
  render(siteFilmsListContainerElement, createFilmsCardTemplate());
}

render(siteFilmsListElement, createFilmsShowMoreTemplates());

// рендер блоков «Top rated» и «Most commented»
FILMS_LIST.EXTRA_TITLES.forEach((title) => {
  render(siteFilmsElement, createFilmsListExtra(title));
});

const siteFilmsExtraElements = siteFilmsElement.querySelectorAll(`.films-list--extra`);

// рендер карточек фильмов в блоки «Top rated» и «Most commented»
siteFilmsExtraElements.forEach((filmsExtraElement) => {
  const FilmExtraContainerElement = filmsExtraElement.querySelector(`.films-list__container`);
  for (let j = 0; j < FILMS_LIST.EXTRA_CARDS_COUNT; j++) {
    render(FilmExtraContainerElement, createFilmsCardTemplate());
  }
});

const siteFooterElement = document.querySelector(`.footer`);

render(siteFooterElement, createFilmDetailTemplate(), `afterend`);
