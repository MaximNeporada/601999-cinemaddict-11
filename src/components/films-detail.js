// компонент Подробной информации о фильме (попап)
import {AbstractSmartComponent} from "./abstract-smart-component";
import {getStringArray} from '../utils/common';
import moment from "moment";
import {CONTROL_BUTTON, EMOJIES} from './../const';

// создания html Постера
const filmDetailPosterMarkup = (film) => {
  const {poster, age} = film;
  return (`<div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${age}</p>
           </div>
          `);
};

// создания html информации о фильме
const filmDetailInfoMarkup = (film) => {
  const {name, originalName, rating, director, writes, actors, releaseDate, runTime, country, genres, description} = film;
  const releaseDateFormat = moment(releaseDate).format(`DD MMMM YYYY`);

  return (`
            <div class="film-details__info-wrap">
            ${filmDetailPosterMarkup(film)}
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">${originalName}</p>
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
                  <td class="film-details__cell">${getStringArray(writes)}</td>
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
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${getStringArray(country)}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Genre${genres.length > 1 ? `s` : ``}</td>
                    <td class="film-details__cell">
                        ${genres.map((element) => `<span class="film-details__genre">${element}</span>`)}
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

// создания html списка коментариев
const commentsListMarkup = (comment) => {
  const {name, date, text, emoji} = comment;
  const dateString = moment(date).fromNow();
  return (`
          <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
            </span>
            <div>
              <p class="film-details__comment-text">${text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${name}</span>
                <span class="film-details__comment-day">${dateString}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>
  `);
};

// создания html элемента эмоции
const emojieMarkup = (emoji, isChecked) => {
  return (`
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? `checked` : ``} >
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>
  `);
};


const parseFormData = () => {

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

    this._emojiName = ``;


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
      emoji: formData.get(`comment-emoji`) ? formData.get(`comment-emoji`) : ``,
      text: formData.get(`comment`) ? formData.get(`comment`) : ``,
    };
  }
}
