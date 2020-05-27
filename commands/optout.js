
exports.run = async (Bot, message, args) => {

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (!args.length) {
    return message.channel.send('You have to specify the role you want to opt out from (case sensitive!)');
  }

  const serverOptinRoles = server.roles.optins.split(',');
  const specifiedRole = args.join(' ');
  const optInRole = message.member.guild.roles.cache.find(role => role.name.includes(specifiedRole));

  if (optInRole) {

    const isRoleAllowed = serverOptinRoles.includes(specifiedRole);

    if (isRoleAllowed) {

      if (!message.member.roles.cache.has(optInRole.id)) {
        return message.channel.send(`${message.member.displayName}, you don't have that role, goob. :)`);
      }

      message.member.roles.remove(optInRole)
        .then(function () {
          message.channel.send(`You are now free from the ${specifiedRole} role, ${message.member.displayName}.`);
        }).catch(function (error) {
          Bot.logger.error(`Opt-Out: Cannot remove role - ${error}`);
          message.channel.send('There was a problem removing your role. Please try again later.');
        });

    } else {
      message.channel.send('Yeah I can\'t opt you out of that one.. maybe a different role?');
    }

  } else {
    Bot.logger.error('Opt-Out: Specified role does not exist.');
    message.channel.send('Looks like this role doesn\'t exist. Did you make a typo? Roles are case-sensitive.');
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 3,
  permitLevel: 0
};

exports.info = {
  name: 'optout',
  description: 'Opt out a user from a role',
  category: 'module',
  usage: '!optout'
};
