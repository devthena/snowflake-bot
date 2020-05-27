
module.exports = (Bot) => {

  Bot.hasCommandPermit = params => {

    if (params.permitLevel == 11) {

      // Server Owner
      return params.message.guild.ownerID === params.message.member.id;

    } else if (params.permitLevel == 10) {

      // Administrators
      if (params.message.guild.ownerID === params.message.member.id) return true;
      else return params.message.member.permissions.has('ADMINISTRATOR');

    } else if (params.permitLevel == 9) {

      // Moderators
      if ((params.message.guild.ownerID === params.message.member.id)
        || (params.message.member.permisions.has('ADMINISTRATOR'))) {

        return true;

      } else {

        const moderatorName = params.server.roles.moderator;
        if (moderatorName.length > 0) {

          const moderatorRole = params.message.member.roles.cache.find(role => role.name.includes(moderatorName));
          if (moderatorRole) return true;
          else return false;

        } else {
          return false;
        }
      }

    } else {
      // Everyone
      return true;
    }
  };

  Bot.isTrue = value => {
    return ['true', '1', true, 1].indexOf(value) >= 0;
  };
};