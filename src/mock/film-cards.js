import {formatRunTime, getRandomInteger, getRandomArrayItem, getRandomArray, getStringArray, getRandomDate} from '../utils/common';
import {generateCommentList} from "./comments";

// объекты с массивыми для генерации данных
const FILM_CARD = {
  names: [
    `The Great Flamarion`,
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `Made for Each Other`
  ],
  originalName: [
    `The Great Flamarion`,
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `Made for Each Other`
  ],
  peoples: [
    `Anthony Mann`,
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
    `Erich von Stroheim`,
    `Mary Beth Hughes`,
    `Dan Duryea`
  ],
  country: [
    `South Africa`,
    `Ecuador`,
    `Italy`,
    `Vietnam`,
    `Solomon Islands`,
    `Ethiopia`,
    `Somalia`,
    `Zimbabwe`,
    `Saudi Arabia`,
    `Spain`,
    `USA`
  ],

  genres: [
    `Drama`,
    `Film-Noir`,
    `Mystery`,
    `Musical`,
    `Comedy`,
    `Cartoon`
  ],
  descriptions: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ],
  posters: [
    `./images/posters/the-dance-of-life.jpg`,
    `./images/posters/popeye-meets-sinbad.png`,
    `./images/posters/santa-claus-conquers-the-martians.jpg`,
    `./images/posters/the-man-with-the-golden-arm.jpg`,
    `./images/posters/sagebrush-trail.jpg`,
    `./images/posters/made-for-each-other.png`
  ],
  age: [
    `18+`,
    `0+`,
    `6+`,
    `13+`,
    `21+`,
  ]
};

// создание рандомного рейтинга
const getRandomRating = () => {
  const firstInt = getRandomInteger(1, 10);
  const secondInt = getRandomInteger(0, 9);

  if (firstInt === 10 || secondInt === 0) {
    return `${firstInt}`;
  }

  return `${firstInt}.${secondInt}`;
};

// runTime: предполагаю что данные  будут приходить в секундах
// releaseDate: предполагаю что будет приходить строкой в формате MM-DD-YYYY
// commentDate:  предполагаю что будет приходить строкой в формате MM-DD-YYYY hh:mm
// генерация карточки Фильма
const generateFilm = () => {
  const descriptions = getRandomArray(FILM_CARD.descriptions, getRandomInteger(1, 5));
  return {
    id: String(new Date() + Math.random()),
    name: getRandomArrayItem(FILM_CARD.names),
    originalName: getRandomArrayItem(FILM_CARD.originalName),
    rating: getRandomRating(),
    director: getRandomArrayItem(FILM_CARD.peoples),
    writes: getRandomArray(FILM_CARD.peoples, getRandomInteger(1, 3)),
    actors: getRandomArray(FILM_CARD.peoples, getRandomInteger(1, 3)),
    releaseDate: getRandomDate(),
    runTime: formatRunTime(Math.random() * 10000),
    country: getRandomArray(FILM_CARD.country, getRandomInteger(1, 2)),
    genres: getRandomArray(FILM_CARD.genres, getRandomInteger(1, 3)),
    description: getStringArray(descriptions, ` `),
    poster: getRandomArrayItem(FILM_CARD.posters),
    age: getRandomArrayItem(FILM_CARD.age),
    comments: generateCommentList(getRandomInteger(0, 15)),
    isWatchList: true,
    isWatched: false,
    isFavorite: true,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms};
