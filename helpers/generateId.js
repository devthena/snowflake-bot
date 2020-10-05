/**
 * Generate a random ID string with a given prefix
 * @param {String} prefix 
 */
const generateId = prefix => {
  return prefix + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

module.exports = generateId;