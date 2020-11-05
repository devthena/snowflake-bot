/**
 * Sort by level and rank
 * @param {Map} toSort 
 */
const sortByRank = toSort => {

  let sortable = [];
  toSort.forEach((obj, id) => {
    if (obj.level > 1 || obj.exp > 0) sortable.push([id, obj.level, obj.exp, obj.points]);
  });

  const compare = (a, b) => {
    if (b > a) return 1;
    if (b < a) return -1;
    return 0;
  };

  sortable.sort((a, b) => {
    return compare(a[1], b[1]) || compare(a[2], b[2]);
  });

  return sortable;
};

module.exports = sortByRank;