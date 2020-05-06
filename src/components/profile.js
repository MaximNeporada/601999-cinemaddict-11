//  компонент Звание пользователя
// звание зависит от количества просмотренных фильмов
// 0 — звание не отображается;
// от 1 до 10 — novice;
// от 11 до 20 — fan;
// от 21 и выше — movie buff;*/
import {AbstractComponent} from "./abstract-component";

const getProfileRaiting = (filmsCountWatched) => {
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
  constructor(filmsCountWatched) {
    super();
    this._filmCount = filmsCountWatched;
  }

  getTemplate() {
    return createProfileTemplate(this._filmCount);
  }
}
