/**
 * Checks if the given parameter has a truth-y value
 * @param {String} value 
 */
const isTrue = value => {
  return ['true', '1', true, 1].indexOf(value) >= 0;
};

module.exports = isTrue;