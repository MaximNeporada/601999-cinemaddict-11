//  компонент Меню (фильтры и статистика);
import {AbstractComponent} from "./abstract-component";

const filtersName = [
  {
    id: `all`,
    name: `All movies`,
  },
  {
    id: `watchlist`,
    name: `Watchlist`,
  },
  {
    id: `history`,
    name: `History`,
  },
  {
    id: `favorites`,
    name: `Favorites`,
  }
];

const returnNameFilter = (id) => {
  const element = filtersName.find((item)=> item.id === id);
  if (element) {
    return element.name;
  }
  return ``;
};

const isStatisticActive = (filters) => {
  const isFilterChecked = filters.find((filter) => filter.checked);
  if (isFilterChecked) {
    return false;
  }

  return true;
};

const createFilterMarkup = (filter) => {
  const {id, count, checked} = filter;
  const name = returnNameFilter(id);
  return (`
        <a href="#${id}" data-filter-type="${id}" class="main-navigation__item ${checked ? `main-navigation__item--active` : ``}" >${name} ${id !== `all` ? `<span class="main-navigation__item-count" >${count}</span>` : ``}</a>
    `);
};

export const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return `<div class="main-navigation__items">
            ${filtersMarkup}
          </div>`;
};

const createMainNavigationTemplate = (filters) => {
  const isStatistic = isStatisticActive(filters);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
          ${createFilterTemplate(filters)}
        </div>
        <a href="#stats" class="main-navigation__additional ${isStatistic ? `main-navigation__item--active` : ``}" data-filter-type="statistic">Stats</a>
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

  setFilterChangeHanlder(handler) {
    const filterLinks = this.getElement().querySelectorAll(`.main-navigation__item`);
    filterLinks.forEach((link)=>{
      link.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        if (evt.target.tagName !== `A`) {
          return;
        }

        const filterType = evt.target.dataset.filterType;

        handler(filterType);
      });
    });
  }

  setFilterChangeStatisticHandler(handler) {
    const statisticLinks = this.getElement().querySelector(`.main-navigation__additional`);
    statisticLinks.addEventListener(`click`, function (evt) {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      handler();
    });
  }
}

