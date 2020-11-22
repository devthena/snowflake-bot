const isTrue = require('../helpers/isTrue');
const serverLog = require('../helpers/serverLog');

/**
 * Adds a default role to a user who just joined the server
 * @listens event:guildMemberAdd
 * @param {Client} Bot 
 * @param {GuildMember} member 
 */
module.exports = (Bot, member) => {

  if (!member.guild.available) return;

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  if (isTrue(server.mods.autoAdd)) {

    const autoAddRole = member.guild.roles.cache.find(role => role.name.includes(server.roles.autoAdd));

    if (autoAddRole) {
      member.roles.add(autoAddRole)
        .then(function () {
          let logEvent = `${member.user.username}#${member.user.discriminator} aka ${member.displayName} has been given the ${server.roles.autoAdd} role.`;
          logEvent += `\nMember ID: ${member.id}`;
          serverLog(Bot, member.guild.name, logEvent);
        }).catch(function (error) {
          let logEvent = `Error: guildMemberAdd Event\n${JSON.stringify(error)}`;
          serverLog(Bot, member.guild.name, logEvent);
        });
    } else {
      let logEvent = `Error: Auto-add role specified does not exist.`;
      serverLog(Bot, member.guild.name, logEvent);
    }
  }

};