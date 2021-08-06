const { NAME } = require('../constants/botConfig');
const serverLog = require('../helpers/serverLog');

/**
 * Logs general warnings received by the Bot
 * @param {Client} Bot 
 * @param {String} info 
 */
module.exports = async (Bot, info) => {
  let logEvent = {
    author: NAME,
    message: `Info: warn Event\nWarning: ${info}`,
    type: 'default'
  };
  serverLog(Bot, logEvent);
};
