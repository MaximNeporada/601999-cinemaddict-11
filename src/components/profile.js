import {AbstractComponent} from "./abstract-component";

export const getProfileRaiting = (filmsCountWatched) => {
  switch (true) {
    case filmsCountWatched === 0 :
      return ``;
    case filmsCountWatched > 0 && filmsCountWatched <= 10 :
      return `novice`;
    case filmsCountWatched >= 11 && filmsCountWatched <= 20 :
      return `fan`;
    case filmsCountWatched > 20 :
      return `movie buff`;
  }

  return ``;
};

export const createProfileTemplate = (filmsCountWatched) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRaiting(filmsCountWatched)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export class Profile extends AbstractComponent {
  constructor(count) {
    super();
    this._filmCount = count;
  }

  getTemplate() {
    return createProfileTemplate(this._filmCount);
  }
}
