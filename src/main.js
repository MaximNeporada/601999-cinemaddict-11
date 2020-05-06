import {Profile} from './components/profile.js';
import {MainNavigation} from './components/main-navigation';
import {render} from "./utils/render";
import {generateFilms} from "./mock/film-cards";
import {generateFilters} from "./mock/filter";
import {PageController} from "./controllers/page-controller";

const FILMS_LIST_CARD_COUNT = 24;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_LIST_CARD_COUNT);
const filters = generateFilters(films);

const countWatched = filters.find((it) => it.id === `history`).count;

const renderFilters = (filtersObject) => {
  const filtersComponent = new MainNavigation(filtersObject);
  render(siteMainElement, filtersComponent);
};

// рендер профиля
const profileComponent = new Profile(countWatched);
render(siteHeaderElement, profileComponent);

// рендер фильтров
renderFilters(filters);

// рендер фильмов
const pageFilmsController = new PageController(siteMainElement);
pageFilmsController.render(films);

// рендер футера
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterStatistics.textContent = `${films.length}`;
