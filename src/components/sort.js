//  компонент Сортировки
import {AbstractComponent} from "./abstract-component";

export const SortType = {
  DEFAULT: `default`,
  DATE_DOWN: `date-down`,
  RATING_DOWN: `rating-down`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE_DOWN}"  class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
    this._classActive = `sort__button--active`;
  }
  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  _removeClassActiveSortButtons() {
    const sortElement = this.getElement().querySelectorAll(`.sort__button`);
    sortElement.forEach((element) => {
      element.classList.remove(this._classActive);
    });
  }

  setSortDefault() {
    this._currentSortType = SortType.DEFAULT;
    this._removeClassActiveSortButtons();
    this.getElement().querySelector(`[data-sort-type="default"]`).classList.add(this._classActive);
  }


  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this._removeClassActiveSortButtons();
      evt.target.classList.add(this._classActive);

      handler(this._currentSortType);
    });
  }
}
