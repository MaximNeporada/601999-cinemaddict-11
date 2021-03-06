import {Comment} from "../components/comment";
import {removeComponent, render} from "../utils/render";

export class CommentController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._comment = null;
    this._commentComponent = null;

    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  render(comment) {
    this._comment = comment;

    this._commentComponent = new Comment(this._comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteButtonClickHandler(this._onDeleteButtonClick);
  }

  destroy() {
    removeComponent(this._commentComponent);
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    evt.target.setAttribute(`disabled`, `true`);
    evt.target.textContent = `Deleting...`;
    const comment = {
      comment: this._comment,
      commentComponent: this._commentComponent,
    };
    this._onDataChange(comment, null);
  }
}
