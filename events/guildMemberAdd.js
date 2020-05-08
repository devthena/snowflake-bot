
module.exports = (Bot, member) => {

  const server = Bot.servers.get(member.guild.id);
  if (!server) return;

  if (Bot.isTrue(server.mods.autoAdd)) {

    const autoAddRole = member.guild.roles.find(role => role.name.includes(server.roles.autoAdd));

    if (autoAddRole) {
      member.addRole(autoAddRole)
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
