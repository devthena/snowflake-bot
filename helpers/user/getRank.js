const sortByRank = require('../sortByRank');

/**
 * Get the rank of a user
 * @param {String} memberId 
 * @param {Map} serverMembers 
 */
const getRank = (memberId, serverMembers) => {

  const sortable = sortByRank(serverMembers);

  let rank = 'n/a';
  sortable.forEach((arr, index) => {
    if (arr[0] === memberId) rank = index + 1;
  });

  return rank;
};

module.exports = getRank;