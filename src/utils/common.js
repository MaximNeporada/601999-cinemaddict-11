// 9 - лубая цифра от 0-9
// функция принимает секунды и возвращает строку в формате 99h 99m также фозвращает null при приеме некоретных данных;
const formatRunTime = (seconds) => {
  let newFormatTime = ``;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - (hours * 60);
  if (hours) {
    newFormatTime += `${hours}h `;
  }
  if (minutes) {
    newFormatTime += `${minutes}m`;
  }
  return newFormatTime ? newFormatTime : null;
};

// функция возвращает рандомное число в заданном промежутке
const getRandomInteger = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// функция возвращает рандомный элемент из массива
const getRandomArrayItem = (arr) => {
  const randomIndex = arr.length > 1 ? getRandomInteger(0, arr.length - 1) : arr[0];

  return arr[randomIndex] || ``;
};

// функция возвращает рандомный массив с заданной или той же длины
const getRandomArray = (arr, lengthNewArr) => {
  let newArr = [...arr];

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
  return arr.reduce((acc, element, index) => {
    if (index === 0) {
      return `${element}`;
    }
    return `${acc}${symbolConcat}${element}`;
  }, ``);
};

// функция нахождения топ 2 фильма по рейтингу
// принимает список фильмов, возвращает список из 2 фильмов
const getTop2FilmsByRating = (arrayFilms) => {
  const newArrayFilms = [...arrayFilms];
  // сортировка списка фильмов по рейтингу от меньшего к большему
  let sortArrayFilmsRaiting = newArrayFilms.sort( (firstItem, secondItem) => {
    return parseFloat(firstItem.rating) - parseFloat(secondItem.rating);
  });

  return sortArrayFilmsRaiting.splice(newArrayFilms.length - 2, newArrayFilms.length);
};


// функция нахождения топ 2 фильма по количеству комментариев
// принимает список фильмов, возвращает список из 2 фильмов
const getTop2FilmsByComments = (arrayFilms) => {
  const newArrayFilms = [...arrayFilms];
  // сортировка списка фильмов по рейтингу от меньшего к большему
  let sortArrayFilmsСcomments = newArrayFilms.sort( (firstItem, secondItem) => {
    const countCommentsFirstItem = firstItem.comments.length;
    const countCommentsSecondItem = secondItem.comments.length;
    return countCommentsFirstItem - countCommentsSecondItem;
  });

  return sortArrayFilmsСcomments.splice(newArrayFilms.length - 2, newArrayFilms.length);
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
  getTop2FilmsByComments
};

