/**
 * Generate a random number between a given min (included) and max (excluded)
 * @param {Number} min
 * @param {Number} max 
 */
const randomIndex = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = randomIndex;