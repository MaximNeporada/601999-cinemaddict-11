//  компонент Кнопка "Show more"
import {createElement} from "../utils/render";

const createFilmsShowMoreTemplates = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export class FilmsShowMore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsShowMoreTemplates();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
