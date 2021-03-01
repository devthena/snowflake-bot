/**
 * Weighted random function
 * @param {Object} toRandomize 
 */
const weightedRandom = toRandomize => {

  let i, sum = 0, r = Math.random();
  for (i in toRandomize) {
    sum += toRandomize[i];
    if (r <= sum) return i;
  }
};

module.exports = weightedRandom;