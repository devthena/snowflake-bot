const botConfig = require('../constants/botConfig');
const logServerId = process.env.LOG_SERVER_ID;

/**
 * Log events in a Discord server
 * @param {Client} Bot
 * @param {String} name
 * @param {String} logEvent 
 */
const log = (Bot, name, logEvent) => {
  const logServer = Bot.guilds.cache.get(logServerId);
  if (logServer) {
    const logChannel = logServer.channels.cache.find(channel => channel.name.includes(botConfig.LOG_CHANNEL));
    if (logServer.available && logChannel) {
      logChannel.send(`:robot: [Server: ${name}]\n${logEvent}`);
    }
  }
};

module.exports = log;