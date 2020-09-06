/**
 * Checks if a user has permission to run a command
 * @param {Object} message 
 * @param {Integer} permitLevel 
 * @param {Object} serverRoles 
 */
const hasPermission = (message, permitLevel, serverRoles) => {

  switch (permitLevel) {

    case 11:
      // Server Owner
      return message.guild.ownerID === message.member.id;
    case 10:
      // Administrator
      if (message.guild.ownerID === message.member.id) return true;
      else return message.member.permissions.has('ADMINISTRATOR');
    case 9:
      // Moderator
      if ((message.guild.ownerID === message.member.id) || (message.member.permissions.has('ADMINISTRATOR'))) return true;
      if (serverRoles.moderator.length > 0) {
        const moderatorRole = message.member.roles.cache.find(role => role.name.includes(moderatorName));
        return !!moderatorRole;
      }
      return false;
    default:
      // Everyone
      return true;
  }

};

module.exports = hasPermission;