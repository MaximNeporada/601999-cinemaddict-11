import {Profile} from "../components/profile";
import {render, replace} from "../utils/render";

export class ProfileController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._profileComponent = null;
    this._filmsCountWatched = 0;

    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    this._filmsCountWatched = this._moviesModel.getFilmsWatchedCount();
    const oldComponent = this._profileComponent;

    this._profileComponent = new Profile(this._filmsCountWatched);

    if (oldComponent) {
      replace(this._profileComponent, oldComponent);
    } else {
      render(container, this._profileComponent);
    }
  }

  _onDataChange() {
    this.render();
  }
}
