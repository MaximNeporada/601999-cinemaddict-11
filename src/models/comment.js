import moment from "moment";

export default class CommentModel {
  constructor(data) {
    this.id = data[`id`] ? data[`id`] : null;
    this.name = data[`author`] ? data[`author`] : ``;
    this.text = data[`comment`];
    this.date = moment(data[`date`]);
    this.emoji = data[`emotion`];
  }

  static parseComment(data) {
    return new CommentModel(data);
  }

  static parseComments(data) {
    return data.map(CommentModel.parseComment);
  }
}
