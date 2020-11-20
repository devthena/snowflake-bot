const botConfig = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

/**
 * Resets the member EXP stats
 * @listens event:guildMemberRemove
 * @param {ClientUser} Bot 
 * @param {GuildMember} member 
 */
module.exports = (Bot, member) => {

  if (!member.guild.available) return;

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  const defaultMember = JSON.parse(JSON.stringify(memberConfig));
  server.members.set(member.id, defaultMember);
  Bot.servers.set(member.guild.id, server);

  const logChannel = member.guild.channels.cache.find(channel => channel.name.includes(botConfig.LOG_CHANNEL));
  if (logChannel) logChannel.send(`${member.displayName} has left the server. All their stats have been reset.`);

};