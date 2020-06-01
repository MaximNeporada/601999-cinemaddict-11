import {AbstractSmartComponent} from "./abstract-smart-component";
import moment from "moment";
import {shakeAnimation} from "../utils/common";

// создания html списка коментариев
const commentsListMarkup = (comment) => {
  const {name, date, text: currentText, emoji} = comment;
  const dateString = moment(date).fromNow();
  const imageEmoji = () => {
    if (emoji) {
      return (`<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`);
    }
    return ``;
  };
  const text = currentText ? currentText.toString() : ``;
  return (
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              ${imageEmoji(emoji)}
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

  failDeleteComment() {
    const buttonDelete = this.getElement().querySelector(`.film-details__comment-delete`);
    buttonDelete.textContent = `delete`;
    buttonDelete.removeAttribute(`disabled`);
    shakeAnimation(this.getElement());
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}
