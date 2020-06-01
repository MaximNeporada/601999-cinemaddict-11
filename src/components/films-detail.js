import {AbstractSmartComponent} from "./abstract-smart-component";
import {CONTROL_BUTTON} from './../const';
import {formatRunTime, getStringArray} from '../utils/common';
import moment from "moment";

// создания html Постера
const filmDetailPosterMarkup = (film) => {
  const {poster, age} = film;
  return (`<div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${age}+</p>
           </div>
          `);
};

// создания html информации о фильме
const filmDetailInfoMarkup = (film) => {
  const {title, originalTitle, rating, director, writers, actors, releaseDate, runTime, country, genres, description} = film;
  const releaseDateFormat = moment(releaseDate).format(`DD MMMM YYYY`);
  const makeArrayGenres = genres ? genres : [];
  return (`
            <div class="film-details__info-wrap">
            ${filmDetailPosterMarkup(film)}
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${getStringArray(writers)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${getStringArray(actors)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateFormat}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatRunTime(runTime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Genre${makeArrayGenres.length > 1 ? `s` : ``}</td>
                    <td class="film-details__cell">
                        ${makeArrayGenres.map((element) => `<span class="film-details__genre">${element}</span>`)}
                    </td>
                </tr>
              </table>
              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
        `);
};

// создания html кнопок контроля
const controlButtonMarkup = (controlButton, isChecked) => {
  const {id, text} = controlButton;
  return (`
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${id}" name="${id}" ${isChecked ? `checked` : ``}>
    <label for="${id}" class="film-details__control-label film-details__control-label--${id}">${text}</label>
  `);
};

// создания html детальной карточки товара
const createFilmDetailTemplate = (film, filmSettings) => {
  const {isWatchList, isWatched, isFavorite} = filmSettings;
  const watchListButton = controlButtonMarkup(CONTROL_BUTTON.watchList, isWatchList);
  const watchedButton = controlButtonMarkup(CONTROL_BUTTON.watched, isWatched);
  const favoriteButton = controlButtonMarkup(CONTROL_BUTTON.favorite, isFavorite);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${filmDetailInfoMarkup(film)}
          <section class="film-details__controls">
            ${watchListButton}
            ${watchedButton}
            ${favoriteButton}
          </section>
        </div>
        <div class="form-details__bottom-container">
        </div>
      </form>
    </section>`
  );
};

export class FilmDetail extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;

    this._filmSettings = {
      isWatchList: this._film.isWatchList,
      isWatched: this._film.isWatched,
      isFavorite: this._film.isFavorite,
    };

    this._closeButtonHandler = null;
    this._submitHandler = null;
  }

  getTemplate() {
    return createFilmDetailTemplate(this._film, this._filmSettings);
  }

  setCloseButtonClickHandler(handler) {
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    closeButton.addEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  removeCloseButtonClickHandler(handler) {
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    closeButton.removeEventListener(`click`, handler);
    this._closeButtonHandler = handler;
  }

  setControlInputsChangeHadler(handler) {
    this.getElement().querySelector(`.film-details__controls`).addEventListener(`change`, handler);
  }

  setSubmitHandler(handler) {
    const keyCodeEnter = 13;
    const form = this.getElement().querySelector(`.film-details__inner`);
    form.addEventListener(`keydown`, (evt) => {
      if ((evt.ctrlKey || evt.metaKey) && (evt.keyCode === keyCodeEnter || evt.code === `Enter`)) {
        handler();
      }
    });
    this._submitHandler = handler;
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonHandler);
    this.setSubmitHandler(this._submitHandler);
  }

  getDataNewComment() {
    const form = this.getElement().querySelector(`.film-details__inner`);
    const formData = new FormData(form);
    return {
      emoji: formData.get(`comment-emoji`),
      text: formData.get(`comment`),
    };
  }
}
