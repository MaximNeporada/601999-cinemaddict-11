import moment from "moment";

export default class Comment {
  constructor(data) {
    this.id = data[`id`] ? data[`id`] : null;
    this.name = data[`author`] ? data[`author`] : ``;
    this.text = data[`comment`];
    this.date = moment(data[`date`]);
    this.emoji = data[`emotion`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  toRAW() {
    return {
      name: this.name,
      date: this.date.toISOString(),
      emotion: this.emoji,
    };
  }
}
