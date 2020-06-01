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
  getStringArray,
  shakeAnimation,
};

