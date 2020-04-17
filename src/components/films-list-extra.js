//  компонент дополнительных блоков «Top rated» и «Most commented»
const createFilmsListExtra = (item) => {
  const {title} = item;
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export {createFilmsListExtra};
