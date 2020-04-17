
const filters = [
  {
    id: `all`,
    name: `All movies`,
  },
  {
    id: `watchlist`,
    name: `Watchlist`,
  },
  {
    id: `history`,
    name: `History`,
  },
  {
    id: `favorites`,
    name: `Favorites`,
  }
];

const generateFilters = (films) => {
  let countWatched = 0;
  let countWatchList = 0;
  let countFavorite = 0;
  const countAll = films.length;

  films.forEach((item) => {
    if (item.isWatchList) {
      countWatchList++;
    }

    if (item.isWatched) {
      countWatched++;
    }

    if (item.isFavorite) {
      countFavorite++;
    }
  });

  const getCountFilter = (element) => {
    let count;
    switch (true) {
      case element === `all`:
        count = countAll;
        break;
      case element === `watchlist`:
        count = countWatchList;
        break;
      case element === `history`:
        count = countWatched;
        break;
      case element === `favorites`:
        count = countFavorite;
        break;
    }

    return count;
  };

  return filters.map((item) => {
    return {
      id: item.id,
      name: item.name,
      isAll: item.id === `all` ? true : false,
      count: getCountFilter(item.id),
    };
  });
};


export {generateFilters};
