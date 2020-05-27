import {AbstractSmartComponent} from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {getWatchedFilms} from "../utils/filter";
import {getProfileRaiting} from "./profile";

const BAR_HEIGHT = 50;
const FILTER_ID_PREFIX = `statistic-`;

const FILTERS_STATISTIC = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const FILTER_MOMENT_UNIT_OF_TIME = {
  'today': `days`,
  'week': `weeks`,
  'month': `months`,
  'year': `years`
};

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const getMapGenreCount = (films) => {
  const genresAll = new Map();

  films.forEach((film) => {
    film.genres.forEach((genre) => {
      let newCountGenre = 1;
      if (genresAll.has(genre)) {
        newCountGenre += genresAll.get(genre);
      }
      genresAll.set(genre, newCountGenre);
    });
  });

  const genreCount = [];
  for (let genreKey of genresAll.keys()) {
    const objGenre = {
      genre: genreKey,
      count: genresAll.get(genreKey)
    };

    genreCount.push(objGenre);
  }

  return genreCount;
};

const getFilmsGenresCount = (films) => {
  if (films.length === 0) {
    return [];
  }
  const genres = getMapGenreCount(films);
  return genres.sort((a, b) => b.count - a.count);
};

const getFilters = (currentFilter) => {
  return Object.values(FILTERS_STATISTIC).map((filter) => {
    const label = filter
      .replace(filter[0], filter[0].toUpperCase())
      .replace(`-`, ` `);
    const checked = filter === currentFilter;

    return `
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter}" value="${filter}" ${checked ? `checked` : ``}>
        <label for="statistic-${filter}" class="statistic__filters-label">${label}</label>
      `.trim();
  });
};

const createStatisticTemplate = (currentFilter, profileRank, watchedFilmsCount, filmDuration, topGenre) => {
  const filters = getFilters(currentFilter);

  return (
    `<section class="statistic">
       <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profileRank}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${filters.join(``)}
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(filmDuration / 60)}<span class="statistic__item-description">h</span>${Math.floor(filmDuration % 60)}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`
  );
};


export class StatisticComponent extends AbstractSmartComponent {
  constructor(films) {
    super();
    this._films = films;
    this._currentFilter = FILTERS_STATISTIC.ALL;
    this._filteredWatchedFilms = getWatchedFilms(this._films);

    this._profileRank = getProfileRaiting(this._filteredWatchedFilms.length);
    this._chartData = getFilmsGenresCount(this._filteredWatchedFilms);
    this._chart = null;

    this._renderChart();
    this._getSelectedFilterType();
  }

  getTemplate() {
    const watchedFilmsCount = this._filteredWatchedFilms.length;
    const topGenre = this._filteredWatchedFilms.length ? this._chartData[0].genre : ``;
    const filmDuration = this._filteredWatchedFilms.reduce(function (sum, current) {
      return sum + current.runTime;
    }, 0);

    return createStatisticTemplate(this._currentFilter, this._profileRank, watchedFilmsCount, filmDuration, topGenre);
  }

  recoveryListeners() {
    this._getSelectedFilterType();
  }

  rerender(films) {
    this._films = films;
    this._filteredWatchedFilms = this._getFilteredDateFilms();
    this._profileRank = getProfileRaiting(this._filteredWatchedFilms.length);
    this._chartData = getFilmsGenresCount(this._filteredWatchedFilms);

    super.rerender();
    this._renderChart();
  }

  _getFilteredDateFilms() {
    const films = getWatchedFilms(this._films);
    const filter = this._currentFilter;

    if (filter === FILTERS_STATISTIC.ALL) {
      return films;
    }
    return films.filter((film) => {
      const watchedDate = moment(film.watchedDate);
      const dateNow = moment();
      const unitOfTime = FILTER_MOMENT_UNIT_OF_TIME[filter];
      const mDateDiff = dateNow.diff(watchedDate, unitOfTime);

      return mDateDiff < 1;
    });
  }

  _getSelectedFilterType() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      const filterElement = evt.target.control;
      if (!filterElement) {
        return;
      }
      const filter = filterElement.id;
      this._currentFilter = getFilterNameById(filter);
      this.rerender(this._films);
    });
  }

  _renderChart() {
    if (!this._filteredWatchedFilms.length) {
      return;
    }
    const chartCtx = this.getElement().querySelector(`.statistic__chart`);
    chartCtx.height = BAR_HEIGHT * this._chartData.length;

    this._chart = new Chart(chartCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._chartData.map((it) => it.genre),
        datasets: [{
          data: this._chartData.map((it) => it.count),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
          barThickness: 24
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }
}
