//  компонент Звание пользователя

//*0 — звание не отображается;
// от 1 до 10 — novice;
// от 11 до 20 — fan;
// от 21 и выше — movie buff;*/
// функция фозвращает звание пользователя

const getProfileRaiting = (filmsCountWathed) => {
  let text = ``;
  switch (true) {
    case filmsCountWathed === 0 :
      text = ``;
      break;
    case filmsCountWathed > 0 && filmsCountWathed <= 10 :
      text = `novice`;
      break;
    case filmsCountWathed >= 11 && filmsCountWathed <= 20 :
      text = `fan`;
      break;
    case filmsCountWathed > 20 :
      text = `movie buff`;
      break;
  }

  return text;
};

export const createProfileTemplate = (filmsCountWathed) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getProfileRaiting(filmsCountWathed)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

