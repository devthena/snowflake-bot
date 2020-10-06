const expConfig = require('../../constants/expConfig');

/**
 * Fetches the information specific to a level
 * @param {Number} level 
 */
const getExpInfo = level => {
  const expObj = expConfig.find(obj => obj.level === level);
  if (expObj) return expObj;
  return null;
};

module.exports = getExpInfo;