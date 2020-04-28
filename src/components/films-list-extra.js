//  компонент дополнительных блоков «Top rated» и «Most commented»
import {createElement} from "../utils/render";

const createFilmsListExtra = (item) => {
  const {id, title} = item;
  return (
    `<section class="films-list--extra" data-id-section="${id}">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};


export class FilmsListExtra {
  constructor(item) {
    this._item = item;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtra(this._item);
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

