const isTrue = require('../helpers/isTrue');

/**
 * Adds a specific opt role to a member
 * @param {ClientUser} Bot 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (isTrue(server.mods.optins)) {

    if (!args.length) {
      return message.channel.send('You have to specify the role you want to opt in to (case sensitive!)');
    }

    const serverOptinRoles = server.roles.optins.split(',');
    const specifiedRole = args.join(' ');
    const optInRole = message.member.guild.roles.cache.find(role => role.name.includes(specifiedRole));

    if (optInRole) {

      const isRoleAllowed = serverOptinRoles.includes(specifiedRole);

      if (isRoleAllowed) {

        if (message.member.roles.cache.has(optInRole.id)) {
          return message.channel.send(`${message.member.displayName}, you\'re already opted in, goob. :)`);
        }

        message.member.roles.add(optInRole)
          .then(function () {
            message.channel.send(`Success! You now have the ${specifiedRole} role, ${message.member.displayName}!`);
          }).catch(function (error) {
            Bot.logger.error(`Opt-in: Cannot add role - ${error}`);
            message.channel.send('There was a problem adding your opt in role. Please try again later.');
          });

      } else {
        message.channel.send('Nice try -- how about we try a different role? :smirk:');
      }

    } else {
      Bot.logger.error('Opt-in: Specified role does not exist.');
      message.channel.send('Looks like this role doesn\'t exist. Did you make a typo? Roles are case-sensitive.');
    }

  } else {
    message.channel.send('Opt-ins are disabled right now. Please try again later.');
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 3,
  permitLevel: 0
};

exports.info = {
  name: 'optin',
  description: 'Adds a specific opt role to a member.',
  category: 'default',
  usage: '!optin <role>'
};
