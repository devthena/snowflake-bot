/**
 * Logs general errors received by the Bot
 * @listens event:error
 * @param {ClientUser} Bot 
 * @param {Object} error 
 */
module.exports = async (Bot, error) => {
  let strError = JSON.stringify(error);
  Bot.logger.error(`[SYS] WebSocket Error: ${strError}`);
};
