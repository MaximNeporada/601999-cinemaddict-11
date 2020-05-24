import {Profile} from './components/profile.js';
import {render} from "./utils/render";
import {generateFilms} from "./mock/film-cards";
import {PageController} from "./controllers/page-controller";
import {MoviesModel} from "./models/movies";
import {FilterController} from "./controllers/filter-controller";

const FILMS_LIST_CARD_COUNT = 26;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const films = generateFilms(FILMS_LIST_CARD_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(films);



// рендер профиля
const profileComponent = new Profile();
render(siteHeaderElement, profileComponent);

// рендер фильтров
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();
// renderFilters(filters);

// рендер фильмов
const pageFilmsController = new PageController(siteMainElement, moviesModel);
pageFilmsController.render();

// рендер футера
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);
siteFooterStatistics.textContent = `${moviesModel.getMovies().length}`;
