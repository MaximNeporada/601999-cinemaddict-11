import moment from "moment";

const formatRunTime = (data) => {
  return moment(data).format(`hh[h] mm[m]`);
};

// функция возвращает рандомное число в заданном промежутке
const getRandomInteger = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// функция возвращает рандомный элемент из массива
const getRandomArrayItem = (arr) => {
  if (arr) {
    const randomIndex = arr.length > 1 ? getRandomInteger(0, arr.length - 1) : arr[0];

    return arr[randomIndex] || ``;
  }

  return ``;
};

// функция возвращает рандомный массив с заданной или той же длины
const getRandomArray = (arr, lengthNewArr) => {
  let newArr = arr ? [...arr] : [];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }

  newArr = typeof lengthNewArr === `undefined` ? newArr : newArr.slice(0, lengthNewArr);

  return newArr;
};

// функция возвращает принимает число и возвращает строку из двух цифр, к пример пришло 9 возвращает 09;
const castTimeFormat = (value) => {
  return String(value).padStart(2, `0`);
};

// функция возврощает строку Даты в формате MM-DD-YYYY и валидирует на высокосный год и февраль для создания даты
const getStringFormatDate = (day, month, year) => {
  let dayInt = parseInt(day, 10);
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);
  if (monthInt === 2 && dayInt > 28) {
    dayInt = yearInt % 4 === 0 ? 29 : 28;
  }
  return `${castTimeFormat(monthInt)}-${castTimeFormat(dayInt)}-${yearInt}`;
};

// функция возвращает строку с элементами массива через ,
const getStringArray = (arr, symbolConcat = `, `) => {
  let string = ``;

  if (arr) {
    const array = Array.from(arr);
    array.forEach((element, index) => {
      if (index === 0) {
        string = `${element}`;
      }
      string = `${string}${symbolConcat}${element}`;
    });
  }

  return string;
};

// функция нахождения топ 2 фильма по рейтингу
// принимает список фильмов, возвращает список из 2 фильмов
const getTop2FilmsByRating = (arrayFilms) => {
  const newArrayFilms = [...arrayFilms];
  // сортировка списка фильмов по рейтингу от меньшего к большему
  let sortArrayFilmsRaiting = newArrayFilms.sort((firstItem, secondItem) => {
    return parseFloat(firstItem.rating) - parseFloat(secondItem.rating);
  });

  return sortArrayFilmsRaiting.splice(newArrayFilms.length - 2, newArrayFilms.length);
};


// функция нахождения топ 2 фильма по количеству комментариев
// принимает список фильмов, возвращает список из 2 фильмов
const getTop2FilmsByComments = (arrayFilms) => {
  const newArrayFilms = [...arrayFilms];
  // сортировка списка фильмов по рейтингу от меньшего к большему
  let sortArrayFilmsСcomments = newArrayFilms.sort((firstItem, secondItem) => {
    const countCommentsFirstItem = firstItem.comments.length;
    const countCommentsSecondItem = secondItem.comments.length;
    return countCommentsFirstItem - countCommentsSecondItem;
  });

  return sortArrayFilmsСcomments.splice(newArrayFilms.length - 2, newArrayFilms.length);
};

// создание рандомной даты в формате MM-DD-YYYY

const getRandomDate = (yearStart = 1900) => {
  let date = new Date();
  const day = getRandomInteger(1, 31);
  const month = getRandomInteger(1, 12);
  const year = getRandomInteger(yearStart, date.getFullYear());
  return getStringFormatDate(day, month, year);
};

const shakeAnimation = (element) => {
  const SHAKE_ANIMATION_TIMEOUT = 600;

  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};

export {
  formatRunTime,
  getRandomInteger,
  getRandomArrayItem,
  getRandomArray,
  castTimeFormat,
  getStringFormatDate,
  getStringArray,
  getTop2FilmsByRating,
  getTop2FilmsByComments,
  getRandomDate,
  shakeAnimation,
};

