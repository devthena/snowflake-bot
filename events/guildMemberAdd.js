const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');
const serverLog = require('../helpers/serverLog');

/**
 * Adds a default role to a user who just joined the server
 * @listens event:guildMemberAdd
 * @param {Client} Bot 
 * @param {GuildMember} member 
 */
module.exports = (Bot, member) => {

  if (!member.guild?.available) return;

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  Bot.db.collection('members').insertOne({
    userId: member.id,
    serverId: member.guild.id,
    ...memberConfig
  });

  if (isTrue(server.mods.autoAdd)) {

    const autoAddRole = member.guild.roles.cache.find(role => role.name.includes(server.roles.autoAdd));

    let logEvent = {
      author: member.guild.name,
      authorIcon: member.guild.iconURL(),
      type: 'default'
    };

    if (autoAddRole) {
      member.roles.add(autoAddRole)
        .then(function () {
          logEvent.message = `${member.user.tag} aka ${member.displayName} has been given the ${server.roles.autoAdd} role.`;
          logEvent.footer = `Discord User ID: ${member.id}`;
          logEvent.type = 'join';
          serverLog(Bot, logEvent);
        }).catch(function (error) {
          logEvent.message = `Error: guildMemberAdd Event\n${JSON.stringify(error)}`;
          serverLog(Bot, logEvent);
        });
    } else {
      logEvent.message = `Error: Auto-add role specified does not exist.`;
      serverLog(Bot, logEvent);
    }
  }

};