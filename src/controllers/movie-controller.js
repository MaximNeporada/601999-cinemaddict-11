import {FilmCard} from "../components/films-card";
import FilmModel from "../models/movie";
import {FilmDetail} from "../components/films-detail";
import {render, replace, removeComponent} from "../utils/render";
import {CommentsBlockController} from "./comments-block-controller";
import {CONTROL_BUTTON} from './../const';
import {CommentsModel} from "../models/comments";
import {encode} from "he";


const Mode = {
  DEFAULT: `default`,
  OPEN: `open`
};

export class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._bodyElement = this._container.closest(`body`);
    this._api = api;

    this._film = null;

    this.remove = null;
    this._filmDetailComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._isWatchList = null;
    this._isWatched = null;
    this._isFavorite = null;
    this._commentController = null;
    this._commentsModel = new CommentsModel();

    this._onEscKeyDown = this._onEscKeyDown.bind(this);

    this._removeFilmDetail = this._removeFilmDetail.bind(this);
    this._onFilmDetailControlsChange = this._onFilmDetailControlsChange.bind(this);

    this._onDataChangeComments = this._onDataChangeComments.bind(this);
    this._onSubmitFilmDetail = this._onSubmitFilmDetail.bind(this);
  }

  getFilm() {
    return this._film;
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
    this._comments = film.comments;
    this._renderComments();

    const showFilmDetail = () => {
      this._onViewChange();
      this._mode = Mode.OPEN;

      this._updateComments();

      this._bodyElement.appendChild(this._filmDetailComponent.getElement());

      this._filmDetailComponent.setCloseButtonClickHandler(this._removeFilmDetail);
      this._filmDetailComponent.setControlInputsChangeHadler(this._onFilmDetailControlsChange);
      this._filmDetailComponent.setSubmitHandler(this._onSubmitFilmDetail);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

    this._filmComponent.setButtonOpenPopupClickHandler(showFilmDetail);

    this._filmComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isWatched = !newFilm.isWatched;
      this._onDataChange(this._film, newFilm);
    });

    this._filmComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isWatchList = !newFilm.isWatchList;
      this._onDataChange(this._film, newFilm);
    });

    this._filmComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._film);
      newFilm.isFavorite = !newFilm.isFavorite;
      this._onDataChange(this._film, newFilm);
    });

    if (oldFilmComponent && oldFilmDetailComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmDetailComponent, oldFilmDetailComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removeFilmDetail();
    }
  }

  destroy() {
    removeComponent(this._filmComponent);
    removeComponent(this._filmDetailComponent);
    this._commentController.destroy();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _removeFilmDetail() {
    this._mode = Mode.DEFAULT;
    this._bodyElement.removeChild(this._filmDetailComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._rerender();
    this._filmDetailComponent.offCloseButtonClickHandler(this._removeFilmDetail);
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

  _onSubmitFilmDetail() {
    const data = this._filmDetailComponent.getDataNewComment();
    const newCommit = {
      date: new Date(),
      comment: encode(data.text),
      emotion: data.emoji,
    };
    this._onDataChangeComments(null, newCommit);
  }

  _renderComments() {
    const containerComments = this._filmDetailComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentController = new CommentsBlockController(containerComments, this._commentsModel, this._onDataChangeComments);
  }

  _updateComments() {
    const containerComments = this._filmDetailComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentController.destroy();

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._commentController = new CommentsBlockController(containerComments, this._commentsModel, this._onDataChangeComments);
        this._commentController.render();
      });
  }

  _rerender() {
    const newFilm = FilmModel.clone(this._film);
    newFilm.isWatchList = this._isWatchList;
    newFilm.isWatched = this._isWatched;
    newFilm.isFavorite = this._isFavorite;
    newFilm.comments = this._comments;
    this._onDataChange(this._film, newFilm);
  }

  _onDataChangeComments(oldComment, newComment) {
    if (oldComment === null) {
      this._commentController.resetFailSendForm();
      this._commentController.blockedNewComment();
      this._api.createComment(this._film.id, newComment)
        .then((comments) => {
          this._commentsModel.addComment(comments[comments.length - 1]);
          this._commentController.updateComments();
          this._commentController.resetNewComment();
          this._comments = this._comments.push(comments[comments.length - 1].id);
        })
        .catch(() => {
          this._commentController.failSendForm();
        });
    }

    if (newComment === null) {
      const oldCommentId = oldComment.comment.id;
      this._api.deleteComment(oldCommentId)
        .then(() => {
          this._commentsModel.removeComment(oldCommentId);
          this._commentController.updateComments();
          const indexOldComment = this._comments.indexOf(oldComment.comment.id);
          if (indexOldComment !== -1) {
            this._comments =  [].concat(this._comments.slice(0, indexOldComment), this._comments.slice(indexOldComment + 1));
          }
        })
        .catch(() => {
          oldComment.commentComponent.failDeleteComment();
        });
    }
  }
}
