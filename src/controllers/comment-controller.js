import {CommentSection} from "../components/comments-section";
import {NewComment} from "../components/new-comment";
import {Comment} from "../components/comment";
import {removeComponent, render} from "../utils/render";

// рендер карточек фильмов, films= массив фильмов, filmList = блок куда вставляем карточки
const renderComment = (comments, commentList) => {
  return comments.map((comment) => {
    const commentComponent = new Comment(comment);
    render(commentList, commentComponent);
    return commentComponent;
  });
};

export class CommentsController {
  constructor(container, commentsModel, onDataChange, onViewChange) {
    this._container = container;

    this._commentListComponent = new CommentSection();
    this._commentsModel = commentsModel;

    this._newComment = new NewComment();
    this._commentListContainer = this._commentListComponent.getElement();
    this._commentListTitleCountComment = this._commentListComponent.getElement().querySelector(`.film-details__comments-count`);
    this._showedCommentsComponent = [];

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
  }


  render() {
    const comments = this._commentsModel.getComments();
    render(this._container, this._commentListComponent);

    this._commentListTitleCountComment.textContent = comments.length > 0 ? comments.length : ``;

    const newComment = renderComment(comments, this._commentListContainer);
    this._showedCommentsComponent = newComment;
    render(this._container, this._newComment);
  }

  destroy() {
    removeComponent(this._commentListComponent);
    removeComponent(this._newComment);
    this._showedCommentsComponent.forEach((comment)=> {
      removeComponent(comment);
    });
  }
}
