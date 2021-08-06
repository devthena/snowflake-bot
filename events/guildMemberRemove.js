const memberConfig = require('../constants/memberConfig');
const serverLog = require('../helpers/serverLog');

/**
 * Resets the member EXP stats after leaving the server
 * @listens event:guildMemberRemove
 * @param {Client} Bot 
 * @param {GuildMember} member 
 */
module.exports = (Bot, member) => {

  if (!member.guild?.available) return;

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  let logEvent = {
    author: member.guild.name,
    authorIcon: member.guild.iconURL(),
    message: `${member.user.tag} aka ${member.displayName} has left the server.`,
    footer: `Discord User ID: ${member.id}`,
    type: 'leave'
  };
  serverLog(Bot, logEvent);

  const defaultMember = JSON.parse(JSON.stringify(memberConfig));
  server.members.set(member.id, defaultMember);
  Bot.servers.set(member.guild.id, server);
};