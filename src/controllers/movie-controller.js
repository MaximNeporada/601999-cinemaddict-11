import {FilmCard} from "../components/films-card";
import {FilmDetail} from "../components/films-detail";
import {render, replace} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`
};

export class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._bodyElement = this._container.closest(`body`);

    this._filmComponent = null;
    this._filmDetailComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._removeFilmDetail = this._removeFilmDetail.bind(this);
  }

  _removeFilmDetail() {
    this._bodyElement.removeChild(this._filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._filmDetailComponent.reset();
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetail();
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetail();
    }
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailComponent = this._filmDetailComponent;
    this._filmComponent = new FilmCard(film);
    this._filmDetailComponent = new FilmDetail(film);

    const showFilmDetail = () => {
      this._onViewChange();
      this._mode = Mode.OPEN;
      this._bodyElement.appendChild(this._filmDetailComponent.getElement());
      this._filmDetailComponent.setCloseButtonClickHandler(this._removeFilmDetail);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._filmComponent.setButtonOpenPopupClickHandler(showFilmDetail);

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatchList: !film.isWatchList,
      }));
    });

    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite,
      }));
    });

    if (oldFilmComponent && oldFilmDetailComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailComponent, oldFilmDetailComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }
}
