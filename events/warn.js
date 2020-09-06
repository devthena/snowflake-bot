/**
 * Logs general warnings received by the Bot
 * @param {ClientUser} Bot 
 * @param {String} info 
 */
module.exports = async (Bot, info) => {
  Bot.logger.warn(`[SYS] General Warning: ${info}`);
};
