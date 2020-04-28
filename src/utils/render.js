// функция создания DOM элемент из шаблона, на входе шаблон элемента, возвращает DOM элемент
const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// функция для рендеринга
const render = (container, component, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
    case RenderPosition.AFTEREND:
      const parent = container.parentNode;
      if (parent) {
        parent.append(component.getElement());
      }
      break;
  }
};

const removeComponent = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export {RenderPosition, createElement, render, removeComponent};
