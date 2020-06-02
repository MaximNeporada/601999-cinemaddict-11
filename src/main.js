import {PageController} from "./controllers/page-controller";
import {MoviesModel} from "./models/movies";
import {FilterController} from "./controllers/filter-controller";
import {ProfileController} from "./controllers/profile-controller";
import API from "./api";

const AUTHORIZATION = `Basic asdiu124iad123`;
const END_POINT = `https://11.ecmascript.pages.academy`;
  // `https://11.ecmascript.pages.academy/cinemaddict`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteFooterStatistics = siteFooterElement.querySelector(`.footer__statistics`);

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

// рендер профиля
const profileComponent = new ProfileController(siteHeaderElement, moviesModel);
profileComponent.render();

// рендер фильтров
const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

// // рендер фильмов
const pageFilmsController = new PageController(siteMainElement, moviesModel, api, siteFooterStatistics);
pageFilmsController.render();


api.getFilms()
  .then((films) => {
    moviesModel.setMovies(films);
    pageFilmsController.render();
  })
  .catch(() => {
    moviesModel.setMovies(``);
    pageFilmsController.render();
  });
