/**
 * Creates a string with formatted Date
 * @param {Date} date
 * @returns {String}
 */
const getFormattedTime = date => {
  const hour = '0' + date.getHours();
  const minutes = '0' + date.getMinutes();
  const seconds = '0' + date.getSeconds();
  return `${hour.slice(-2)}:${minutes.slice(-2)}:${seconds.slice(-2)} UTC`;
};

module.exports = getFormattedTime;