//  компонент Меню (фильтры и статистика);
import {AbstractComponent} from "./abstract-component";

const createFilterMarkup = (filter, isChecked) => {
  const {id, name, count, isAll} = filter;

  return (`
        <a href="#${id}" class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``}">${name} ${!isAll ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>
    `);
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return `<div class="main-navigation__items">
            ${filtersMarkup}
          </div>`;
};

const createMainNavigationTemplate = (filters) => {
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${createFilterTemplate(filters)}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export class MainNavigation extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }
}

