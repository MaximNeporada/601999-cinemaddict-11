
const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const EMOJIES = [`smile`, `sleeping`, `puke`, `angry`];
const MAX_COMMENTS_COUNT = 20;
const MAX_CARD_DESCRIPTION_LENGTH = 140;

const CONTROL_BUTTON = {
  watchList: {
    id: `watchlist`,
    text: `Add to watchlist`,
    classButton: `add-to-watchlist`,
  },
  watched: {
    id: `watched`,
    text: `Already watched`,
    classButton: `mark-as-watched`,
  },
  favorite: {
    id: `favorite`,
    text: `Add to favorites`,
    classButton: `favorite`,
  },
};

export {MONTH_NAMES, EMOJIES, MAX_COMMENTS_COUNT, MAX_CARD_DESCRIPTION_LENGTH, CONTROL_BUTTON};


