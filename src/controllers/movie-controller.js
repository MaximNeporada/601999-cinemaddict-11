import {FilmCard} from "../components/films-card";
import {FilmDetail} from "../components/films-detail";
import {render, replace, removeComponent} from "../utils/render";
import {CommentsController} from "./comment-controller";
import {CONTROL_BUTTON} from './../const';
import {CommentsModel} from "../models/comments";


const Mode = {
  DEFAULT: `default`,
  OPEN: `open`
};

export class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._bodyElement = this._container.closest(`body`);

    this._film = null;

    this.remove = null;
    this._filmDetailComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._isWatchList = null;
    this._isWatched = null;
    this._isFavorite = null;
    this.commentController = null;
    this._commentsModel = new CommentsModel();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._removeFilmDetail = this._removeFilmDetail.bind(this);
    this._onFilmDetailControlsChange = this._onFilmDetailControlsChange.bind(this);
  }

  _removeFilmDetail() {
    this._mode = Mode.DEFAULT;
    this._bodyElement.removeChild(this._filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._rerender();
    this._filmDetailComponent.removeCloseButtonClickHandler(this._removeFilmDetail);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._removeFilmDetail();
    }
  }

  _onFilmDetailControlsChange(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const controlType = evt.target.id;
    switch (controlType) {
      case CONTROL_BUTTON.watchList.id:
        this._isWatchList = !this._isWatchList;
        break;
      case CONTROL_BUTTON.watched.id:

        this._isWatched = !this._isWatched;

        break;
      case CONTROL_BUTTON.favorite.id:

        this._isFavorite = !this._isFavorite;
        break;
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

    this._film = film;
    this._isWatchList = film.isWatchList;
    this._isWatched = film.isWatched;
    this._isFavorite = film.isFavorite;

    this._commentsModel.setComments(this._film.comments);

    const containerComments = this._filmDetailComponent.getElement().querySelector(`.form-details__bottom-container`);
    this.commentController = new CommentsController(containerComments, this._commentsModel, this._onDataChange, this._onViewChange);
    this.commentController.render();

    const showFilmDetail = () => {

      this._onViewChange();
      this._mode = Mode.OPEN;

      this._bodyElement.appendChild(this._filmDetailComponent.getElement());

      this._filmDetailComponent.setCloseButtonClickHandler(this._removeFilmDetail);
      this._filmDetailComponent.setControlInputsChangeHadler(this._onFilmDetailControlsChange);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._filmComponent.setButtonOpenPopupClickHandler(showFilmDetail);

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isWatched: !film.isWatched,
      }));
    });

    this._filmComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
        isWatchList: !film.isWatchList,
      }));
    });

    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(film, Object.assign({}, film, {
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

  getFilm() {
    return this._film;
  }

  _rerender() {
    this._onDataChange(this._film, Object.assign({}, this._film, {
      isWatchList: this._isWatchList,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
    }));
  }

  destroy() {
    removeComponent(this._filmComponent);
    removeComponent(this._filmDetailComponent);
    this.commentController.destroy();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
