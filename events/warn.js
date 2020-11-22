const botConfig = require('../constants/botConfig');
const serverLog = require('../helpers/serverLog');

/**
 * Logs general warnings received by the Bot
 * @param {Client} Bot 
 * @param {String} info 
 */
module.exports = async (Bot, info) => {
  let logEvent = `Info: warn Event\nWarning: ${info}`;
  serverLog(Bot, botConfig.NAME, logEvent);
};
