import {AbstractComponent} from "./abstract-component";

const createLoadingTemplate = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title">Loading...</h2>
      </section>`
  );
};

export class LoadingComponent extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
