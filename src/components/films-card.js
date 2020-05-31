import {AbstractComponent} from "./abstract-component";
import {formatRunTime, getRandomArrayItem} from "../utils/common";
import moment from "moment";
import {MAX_CARD_DESCRIPTION_LENGTH, CONTROL_BUTTON} from "./../const";


// получаем обрезанную строку если строка > MAX_CARD_DESCRIPTION_LENGTH
const getShortDescription = (description) => {
  if (description > MAX_CARD_DESCRIPTION_LENGTH) {
    const symbolEllipsis = `…`;
    const lengthString = MAX_CARD_DESCRIPTION_LENGTH - 1;
    return `${description.splice(0, lengthString)}${symbolEllipsis}`;
  }

  return description;
};

// создания html кнопок контроля
const controlButtonMarkup = (controlButton, isChecked) => {
  const controlsItemActiveClass = `film-card__controls-item--active`;
  const {classButton, text} = controlButton;
  return (`
        <button class="film-card__controls-item button film-card__controls-item--${classButton} ${isChecked ? controlsItemActiveClass : `` }">${text}</button>
  `);
};

const createFilmCardTemplate = (film) =>{
  const {title, rating, releaseDate, runTime, genres, poster, comments, description, isWatchList, isWatched, isFavorite} = film;
  const releaseYear = moment(releaseDate).format(`YYYY`);
  const shortDescription = getShortDescription(description);
  const watchListButton = controlButtonMarkup(CONTROL_BUTTON.watchList, isWatchList);
  const watchedButton = controlButtonMarkup(CONTROL_BUTTON.watched, isWatched);
  const favoriteButton = controlButtonMarkup(CONTROL_BUTTON.favorite, isFavorite);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${formatRunTime(runTime)}</span>
        <span class="film-card__genre">${getRandomArrayItem(genres)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${watchListButton}
        ${watchedButton}
        ${favoriteButton}
      </form>
    </article>`
  );
};

export class FilmCard extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setButtonOpenPopupClickHandler(handler) {
    const filmPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmTitle = this.getElement().querySelector(`.film-card__title`);
    const filmComments = this.getElement().querySelector(`.film-card__comments`);
    const cardButtonsOpenPopup = [filmPoster, filmTitle, filmComments];

    cardButtonsOpenPopup.forEach((button) => button.addEventListener(`click`, handler));
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }

  setWatchListButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }
}
