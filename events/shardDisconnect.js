/**
 * Logs disconnection errors received by the Bot
 * @listens event:shardDisconnect
 * @param {ClientUser} Bot 
 * @param {CloseEvent} event 
 * @param {Number} shardId 
 */
module.exports = async (Bot, event, shardId) => {
  Bot.logger.error(`[SYS] WebSocket Disconnected: ${shardId} - ${event}`);
};
