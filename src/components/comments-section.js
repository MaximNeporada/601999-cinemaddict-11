import {AbstractComponent} from "./abstract-component";

// создания html секции коментариев
const commentsWrapMarkup = () => {
  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"></span></h3>
        <ul class="film-details__comments-list"></ul>
    </section>`
  );
};

export class CommentSection extends AbstractComponent {
  getTemplate() {
    return commentsWrapMarkup();
  }
}

