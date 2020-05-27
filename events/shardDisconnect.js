
module.exports = async (Bot, event, shardId) => {
  Bot.logger.error(`[SYS] WebSocket Disconnected: ${shardId} - ${event}`);
};
