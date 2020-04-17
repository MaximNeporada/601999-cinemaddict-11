// 9 - лубая цифра от 0-9
// функция принимает секунды и возвращает строку в формате 99h 99m;
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
  return newFormatTime ? newFormatTime : undefined;
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
const getRandomArray = (arr, lengthNewArr = undefined) => {
  let newArr = [...arr];

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = newArr[j];
    newArr[j] = newArr[i];
    newArr[i] = temp;
  }

  newArr = lengthNewArr !== undefined ? newArr.slice(0, lengthNewArr) : newArr;

  return newArr;
};

// функция возвращает строку 99
const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

// функция возврощает строку Даты в формате MM-DD-YYYY и валидирует на высокосный год и февраль для создания даты
const getStringFormatDate = (day, month, year) => {
  let dayInt = parseInt(day, 10);
  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);
  if (monthInt === 2 && dayInt > 28) {
    const isLeapYear = yearInt % 4 === 0;
    if (isLeapYear) {
      dayInt = 29;
    } else {
      dayInt = 28;
    }
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

// функция нахождения максимального значения
const getMaxNumberOfKey = (array, keyFind, countElements) => {
  const newArray = [...array];
  const isArray = Array.isArray(newArray[0][keyFind]);
  let sortArray = newArray.sort((firstItem, secondItem) => {
    let firstItemInt;
    let secondItemInt;
    if (isArray) {
      firstItemInt = parseInt(firstItem[keyFind].length, 10);
      secondItemInt = parseInt(secondItem[keyFind].length, 10);
    } else {
      firstItemInt = parseFloat(firstItem[keyFind]);
      secondItemInt = parseFloat(secondItem[keyFind]);
    }

    return firstItemInt - secondItemInt;
  });

  return sortArray.splice(sortArray.length - countElements, sortArray.length);
};

export {
  formatRunTime,
  getRandomInteger,
  getRandomArrayItem,
  getRandomArray,
  castTimeFormat,
  getStringFormatDate,
  getStringArray,
  getMaxNumberOfKey
};

