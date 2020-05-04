//  компонент дополнительных блоков «Top rated» и «Most commented»
import {AbstractComponent} from "./abstract-component";

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

export class FilmsListExtra extends AbstractComponent {
  constructor(item) {
    super();
    this._item = item;
  }

  getTemplate() {
    return createFilmsListExtra(this._item);
  }
}

