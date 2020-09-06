const isTrue = require('../helpers/isTrue');

module.exports = (Bot, member) => {

  if (!member.guild.available) return;

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  if (isTrue(server.mods.autoAdd)) {

    const autoAddRole = member.guild.roles.cache.find(role => role.name.includes(server.roles.autoAdd));

    if (autoAddRole) {
      member.roles.add(autoAddRole)
        .then(function () {
          Bot.logger.info(`[SYS] Added role ${server.roles.autoAdd} to ${member.user.username}`);
        }).catch(function (error) {
          Bot.logger.error(`[SYS] guildMemberAdd: ${error}`);
        });
    } else {
      Bot.logger.error('[SYS] guildMemberAdd: Specified auto-add role does not exist');
    }
  }

};