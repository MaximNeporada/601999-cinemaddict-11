//  компонент Кнопка "Show more"
import {AbstractComponent} from "./abstract-component";

const createFilmsShowMoreTemplates = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export class FilmsShowMore extends AbstractComponent {
  getTemplate() {
    return createFilmsShowMoreTemplates();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
