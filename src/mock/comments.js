// создание рандомного рейтинга
import {getRandomDate, getRandomArrayItem, getRandomInteger} from "../utils/common";
import {EMOJIES, MAX_COMMENTS_COUNT} from "../const";
import moment from "moment";
const COMMENT = {
  name: [
    `Tim Macoveev`,
    `John Doe`,
    `Ira  Woods`,
    `Jerome Chandler`,
    `David Harrell`,
  ],
  text: [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`,
  ],
};


// создания объекта комментария
const generateComment = () => {
  return {
    name: getRandomArrayItem(COMMENT.name),
    date: getRandomDate(2018),
    text: getRandomArrayItem(COMMENT.text),
    emoji: getRandomArrayItem(EMOJIES),
  };
};

// создание списка комментариев
const generateCommentList = () => {
  let comments = [];
  let lengthArr = getRandomInteger(0, MAX_COMMENTS_COUNT);
  for (let i = 0; i < lengthArr; i++) {
    const comment = generateComment();
    // console.log(comment);
    comments.push(comment);
  }

  const commentsSort = comments.sort((a, b) => moment(a.date, `DD-MM-YYYY`) - moment(b.date, `DD-MM-YYYY`));

  return commentsSort;
};


export {generateCommentList};
