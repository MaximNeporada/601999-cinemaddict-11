import {AbstractSmartComponent} from "./abstract-smart-component";
import moment from "moment";

// создания html списка коментариев
const commentsListMarkup = (comment) => {
  const {name, date, text, emoji} = comment;
  const dateString = moment(date).fromNow();
  return (
    `<li class="film-details__comment">
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
          </li>`
  );
};

export class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return commentsListMarkup(this._comment);
  }

  recoveryListeners() {
    return;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}
