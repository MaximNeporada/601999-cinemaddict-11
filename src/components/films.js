//  компонент секкция Фильм
import {AbstractComponent} from "./abstract-component";

const createFilmsTemplate = () =>{
  return (
    `<section class="films"></section>`
  );
};

export class Films extends AbstractComponent {
  getTemplate() {
    return createFilmsTemplate();
  }
}
