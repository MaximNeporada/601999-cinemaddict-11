import {MainNavigation} from "../components/main-navigation";
import {FilterType} from "../const";
import {render, replace} from "../utils/render";
import {getTasksByFilter} from "../utils/filter";

export class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onStatisticHandler = this._onStatisticHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getMoviesAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        id: filterType,
        count: getTasksByFilter(allMovies, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new MainNavigation(filters);
    this._filterComponent.setFilterChangeHanlder(this._onFilterChange);
    this._filterComponent.setFilterChangeStatisticHandler(this._onStatisticHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this._onDataChange();
  }

  _onStatisticHandler() {
    this._moviesModel.setFilter(`statistic`);
    this._activeFilterType = `statistic`;
    this._onDataChange();
  }

  _onDataChange() {
    this.render();
  }
}
