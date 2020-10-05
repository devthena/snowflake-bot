/**
 * Logs reconnecting errors received by the Bot
 * @param {ClientUser} Bot 
 * @param {Number} shardId 
 */
module.exports = async (Bot, shardId) => {
  Bot.logger.error(`[SYS] WebSocket Reconnecting for ${shardId}...`);
};
