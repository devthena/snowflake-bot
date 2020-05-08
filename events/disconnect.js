
module.exports = async (Bot, event) => {
  Bot.logger.error(`[SYS] WebSocket Disconnected: ${event}`);
};
