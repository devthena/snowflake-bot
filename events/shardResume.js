/**
 * Logs information when connection resumes
 * @param {Client} Bot 
 * @param {Number} shardId 
 * @param {Number} replayedEvents 
 */
module.exports = async (Bot, shardId, replayedEvents) => {
  Bot.logger.info(`[SYS] WebSocket Resume: ${shardId} - ${replayedEvents} replayed events`);
};
