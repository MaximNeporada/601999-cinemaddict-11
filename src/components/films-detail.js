// компонент Подробной информации о фильме (попап)
import {AbstractComponent} from "./abstract-component";
import {getStringArray, castTimeFormat} from '../utils/common';
import {CONTROL_BUTTON, EMOJIES, MONTH_NAMES} from './../const';

// создания html Постера
const filmDetailPosterMarkup = (film) => {
  const {poster, age} = film;
  return (`<div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${age}</p>
           </div>
          `);
};

// перевод даты в нуный формат отображения
const getStringFormateRealeaseDate = (date) => {
  const releaseDate = new Date(date);
  const month = MONTH_NAMES[releaseDate.getMonth()];
  return `${releaseDate.getDate()} ${month} ${releaseDate.getFullYear()}`;
};

// создания html информации о фильме
const filmDetailInfoMarkup = (film) => {
  const {name, originalName, rating, director, writes, actors, releaseDate, runTime, country, genres, description} = film;
  const releaseDateFormat = getStringFormateRealeaseDate(releaseDate);

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
    <label for="watchlist" class="film-details__control-label film-details__control-label--${id}}">${text}</label>
  `);
};

// создания html списка коментариев
const commentsListMarkup = (comment) => {
  const {name, date, text, emoji} = comment;
  let dateFormat = new Date(date);
  const dateString = `${dateFormat.getFullYear()}/${castTimeFormat(dateFormat.getMonth() + 1)}/${castTimeFormat(dateFormat.getDate())} ${castTimeFormat(dateFormat.getHours())}:${castTimeFormat(dateFormat.getMinutes())}`;
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
const emojieMarkup = (emoji) => {
  return (`
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>
  `);
};

// создания html секции коментариев
const commentsWrapMarkup = (film) => {
  const {comments} = film;
  const commentsList = comments.map((item) => {
    return commentsListMarkup(item);
  }).join(`\n`);

  const emojiesMarkup = EMOJIES.map((emoji) => {
    return emojieMarkup(emoji);
  }).join(`\n`);

  return (`
    <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsList}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojiesMarkup}
              </div>
            </div>
          </section>
  `);
};

// создания html детальной карточки товара
const createFilmDetailTemplate = (film) => {
  const {isWatchList, isWatched, isFavorite} = film;
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${filmDetailInfoMarkup(film)}
          <section class="film-details__controls">
            ${controlButtonMarkup(CONTROL_BUTTON.watchList, isWatchList)}
            ${controlButtonMarkup(CONTROL_BUTTON.watched, isWatched)}
            ${controlButtonMarkup(CONTROL_BUTTON.favorite, isFavorite)}
          </section>
        </div>

        <div class="form-details__bottom-container">
          ${commentsWrapMarkup(film)}
        </div>
      </form>
    </section>`
  );
};

export class FilmDetail extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmDetailTemplate(this._film);
  }

  setCloseButtonClickHandler(handler) {
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    closeButton.addEventListener(`click`, handler);
  }
}
