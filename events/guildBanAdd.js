const serverLog = require('../helpers/serverLog');

/**
 * Resets the member EXP stats after being banned
 * @listens event:guildBanAdd
 * @param {Client} Bot 
 * @param {User} user
 */
module.exports = (Bot, guild, user) => {

  if (!guild.available) return;

  const server = Bot.servers.get(guild.id);
  if (!server) return;

  let logEvent = `${user.username}#${user.discriminator} has been banned from the server.`;
  logEvent += `\nMember ID: ${user.id}`;
  serverLog(Bot, guild.name, logEvent);

  server.members.delete(user.id);
  Bot.servers.set(guild.id, server);
};