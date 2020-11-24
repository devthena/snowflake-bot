/**
 * Sort by amount of points
 * @param {Map} toSort 
 */
const sortByCoin = toSort => {

  let sortable = [];
  toSort.forEach((obj, id) => {
    if (obj.points > 1) sortable.push([id, obj.points, obj.level]);
  });

  const compare = (a, b) => {
    if (b > a) return 1;
    if (b < a) return -1;
    return 0;
  };

  sortable.sort((a, b) => {
    return compare(a[1], b[1]);
  });

  return sortable;
};

module.exports = sortByCoin;