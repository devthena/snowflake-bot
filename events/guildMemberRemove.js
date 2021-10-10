const serverLog = require('../helpers/serverLog');

/**
 * Remove member from the database when they leave
 * @listens event:guildMemberRemove
 * @param {Client} Bot 
 * @param {GuildMember} member 
 */
module.exports = (Bot, member) => {

  if (!member.guild?.available) return;

  let logEvent = {
    author: member.guild.name,
    authorIcon: member.guild.iconURL(),
    message: `${member.user.tag} aka ${member.displayName} has left the server.`,
    footer: `Discord User ID: ${member.id}`,
    type: 'leave'
  };
  serverLog(Bot, logEvent);

  Bot.db.collection('members').deleteOne({ userId: member.id });
};