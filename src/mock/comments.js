// создание рандомного рейтинга
import {getRandomDate, getRandomArrayItem} from "../utils/common";
import {EMOJIES, COMMENT} from "../const";

// создания объекта комментария
const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    name: getRandomArrayItem(COMMENT.name),
    date: getRandomDate(2018),
    text: getRandomArrayItem(COMMENT.text),
    emoji: getRandomArrayItem(EMOJIES),
  };
};

// создание списка комментариев
const generateCommentList = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};


export {generateCommentList};
