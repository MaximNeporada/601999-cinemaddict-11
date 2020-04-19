import {getRandomArrayItem} from "./../utils";
import {MAX_CARD_DESCRIPTION_LENGTH, CONTROL_BUTTON} from "./../const";

// получаем обрезанную строку если строка > MAX_CARD_DESCRIPTION_LENGTH
const getShortDescription = (description) => {
  if (description > MAX_CARD_DESCRIPTION_LENGTH) {
    const symbolEllipsis = `…`;
    const lengthString = MAX_CARD_DESCRIPTION_LENGTH - 1;
    return `${description.splice(0, lengthString)}${symbolEllipsis}`;
  }

  return description;
};

// создания html кнопок контроля
const controlButtonMarkup = (conrolButton, isChecked) => {
  const controlsItemActiveClass = `film-card__controls-item--active`;
  const {classButton, text} = conrolButton;
  return (`
        <button class="film-card__controls-item button film-card__controls-item--${classButton} ${isChecked ? controlsItemActiveClass : `` }">${text}</button>
  `);
};

const createFilmsCardTemplate = (film) =>{
  const {name, rating, releaseDate, runTime, genres, poster, comments, description, isWatchList, isWatched, isFavorite} = film;
  const releaseDateFormat = new Date(releaseDate);
  const releaseYear = releaseDateFormat.getFullYear();
  const shortDescription = getShortDescription(description);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${runTime}</span>
        <span class="film-card__genre">${getRandomArrayItem(genres)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        ${controlButtonMarkup(CONTROL_BUTTON.watchList, isWatchList)}
        ${controlButtonMarkup(CONTROL_BUTTON.watched, isWatched)}
        ${controlButtonMarkup(CONTROL_BUTTON.favorite, isFavorite)}
      </form>
    </article>`
  );
};

export {createFilmsCardTemplate};
