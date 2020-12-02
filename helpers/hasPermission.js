/**
 * Checks if a user has permission to run a command
 * @param {Message} message
 * @param {Object} member
 * @param {Number} permitLevel 
 * @param {Object} serverRoles 
 */
const hasPermission = (message, member, permitLevel, serverRoles) => {

  let error = null;

  switch (permitLevel) {

    case 11:
      // Server Owner
      error = 'You need to be the owner of this server to use this command.';
      return message.guild.ownerID === message.member.id || error;
    case 10:
      // Administrator
      error = 'You need to be at least an administrator to use this command.';
      if (message.guild.ownerID === message.member.id) return true;
      return message.member.permissions.has('ADMINISTRATOR') || error;
    case 9:
      // Moderator
      error = 'You need to be at least a moderator to use this command.';
      if ((message.guild.ownerID === message.member.id) || (message.member.permissions.has('ADMINISTRATOR'))) return true;
      if (serverRoles.moderator.length > 0) {
        const moderatorRole = message.member.roles.cache.find(role => role.name.includes(serverRoles.moderator));
        return !!moderatorRole || error;
      }
      return error;
    case 'L2':
      // User Level 2 Minimum
      error = 'You need to be at least level 2 to use this command.';
      return member.level >= 2 || error;
    default:
      // Everyone
      return true;
  }

};

module.exports = hasPermission;