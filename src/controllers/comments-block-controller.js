import {CommentSection} from "../components/comments-section";
import {NewComment} from "../components/new-comment";
import {CommentController} from "../controllers/comment-controller";
import {removeComponent, render} from "../utils/render";

// рендер карточек фильмов, films= массив фильмов, filmList = блок куда вставляем карточки
const renderComment = (comments, commentList, onDataChange) => {
  return comments.map((comment) => {
    const commentComponent = new CommentController(commentList, onDataChange);
    commentComponent.render(comment);
    return commentComponent;
  });
};

export class CommentsBlockController {
  constructor(container, commentsModel, onDataChange) {
    this._container = container;

    this._commentListComponent = new CommentSection();
    this._commentsModel = commentsModel;

    this._newComment = new NewComment();
    this._commentListContainer = this._commentListComponent.getElement();
    this._commentListTitleCountComment = this._commentListComponent.getElement().querySelector(`.film-details__comments-count`);
    this._showedCommentsComponent = [];

    this._onDataChange = onDataChange;
  }


  render() {
    const comments = this._commentsModel.getComments();

    render(this._container, this._commentListComponent);
    this._updateTitleCount(comments.length);
    this._renderComments(comments);

    render(this._container, this._newComment);
  }

  _updateTitleCount(count) {
    this._commentListTitleCountComment.textContent = count;
  }

  _renderComments(comments) {
    this._removeComments();
    if (comments.length > 0) {
      const newComment = renderComment(comments, this._commentListContainer, this._onDataChange);
      this._showedCommentsComponent = newComment;
    }
  }

  _removeComments() {
    this._showedCommentsComponent.forEach((comment) => comment.destroy());
    this._showedCommentsComponent = [];
  }

  resetNewComment() {
    this._newComment.reset();
  }

  destroy() {
    removeComponent(this._commentListComponent);
    removeComponent(this._newComment);
    this._removeComments();
  }

  updateComments() {
    const comments = this._commentsModel.getComments();
    this._renderComments(comments);
    this._updateTitleCount(comments.length);
  }
}