const botConfig = require('../constants/botConfig');
const serverLog = require('../helpers/serverLog');

/**
 * Logs general errors received by the Bot
 * @listens event:error
 * @param {Client} Bot 
 * @param {Object} error 
 */
module.exports = async (Bot, error) => {
  let logEvent = {
    author: botConfig.NAME,
    message: `Info: error Event\nError: ${JSON.stringify(error)}`
  };
  serverLog(Bot, logEvent);
};
