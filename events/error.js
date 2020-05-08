
module.exports = async (Bot, error) => {
  let strError = JSON.stringify(error);
  Bot.logger.error(`[SYS] WebSocket Error: ${strError}`);
};
