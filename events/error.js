const { NAME } = require('../constants/botConfig');
const serverLog = require('../helpers/serverLog');

/**
 * Logs general errors received by the Bot
 * @listens event:error
 * @param {Client} Bot 
 * @param {Object} error 
 */
module.exports = async (Bot, error) => {
  let logEvent = {
    author: NAME,
    message: `Info: error Event\nError: ${JSON.stringify(error)}`,
    type: 'default'
  };
  serverLog(Bot, logEvent);
};
