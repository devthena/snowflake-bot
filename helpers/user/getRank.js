const botConfig = require('../../constants/botConfig');

/**
 * Get the rank of a user
 * @param {String} memberId 
 * @param {Map} serverMembers 
 */
const getRank = (memberId, serverMembers) => {

  let sortable = [];
  serverMembers.forEach((obj, id) => {
    if (obj.level > 1 || obj.exp > 0) sortable.push([id, obj.level, obj.exp]);
  });

  sortable.sort((a, b) => {
    const aValue = (a[1] * botConfig.LVL_MULTIPLIER) + a[2];
    const bValue = (b[1] * botConfig.LVL_MULTIPLIER) + b[2];
    return bValue - aValue;
  });

  let rank = 'n/a';
  sortable.forEach((arr, index) => {
    if (arr[0] === memberId) rank = index + 1;
  });

  return rank;
};

module.exports = getRank;