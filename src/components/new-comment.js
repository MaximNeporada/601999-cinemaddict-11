import {EMOJIES} from "../const";
import {AbstractSmartComponent} from "./abstract-smart-component";

// создания html элемента эмоции
const emojieMarkup = (emoji, isChecked) => {
  return (`
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked ? `checked` : ``} >
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>
  `);
};

const emojiImageAdd = (emoji) => {
  if (emoji) {
    return `
      <img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      `;
  }
  return ``;
};

const newCommentMarkup = (emojiChecked, valueTextarea) => {
  const emojiesMarkup = EMOJIES.map((emoji) => {
    const isChecked = emoji === emojiChecked;
    return emojieMarkup(emoji, isChecked);
  }).join(`\n`);

  return (
    `<div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label">
              ${emojiImageAdd(emojiChecked)}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${valueTextarea}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojiesMarkup}
            </div>
        </div>`
  );
};

export class NewComment extends AbstractSmartComponent {
  constructor() {
    super();
    this._emojiName = ``;
    this._valueTextare = ``;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return newCommentMarkup(this._emojiName, this._valueTextare);
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        this._emojiName = evt.target.value;
        this.rerender();
      });

    element.querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt)=>{
      this._valueTextare = evt.target.value;
    });
  }

  reset() {
    this._emojiName = ``;
    this._valueTextare = ``;
    this.rerender();
  }


  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }
}
