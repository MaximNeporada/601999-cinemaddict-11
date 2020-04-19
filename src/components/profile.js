//  компонент Звание пользователя
// 0 — звание не отображается;
// от 1 до 10 — novice;
// от 11 до 20 — fan;
// от 21 и выше — movie buff;*/
// функция фозвращает звание пользователя

const getProfileRaiting = (filmsCountWathed) => {
  switch (true) {
    case filmsCountWathed === 0 :
      return``;
    case filmsCountWathed > 0 && filmsCountWathed <= 10 :
      return `novice`;
    case filmsCountWathed >= 11 && filmsCountWathed <= 20 :
      return `fan`;
    case filmsCountWathed > 20 :
      return `movie buff`;
  }

  return ``;
};

export const createProfileTemplate = (filmsCountWathed) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRaiting(filmsCountWathed)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

