const botConfig = require('../constants/botConfig');

/**
 * Displays the current amount of points a member has
 * @param {ClientUser} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  let member = server.members.get(message.member.id);
  if (!member) {
    member = { points: 0 };
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(`${message.member.displayName}, you do not have any ${currencyText} yet. :neutral_face:`);
  }

  message.channel.send(`${message.member.displayName}, your current balance is: ${member.points} ${currency}`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 3,
  permitLevel: 0
};

exports.info = {
  name: 'points',
  description: 'Displays the current amount of points a member has.',
  category: 'default',
  usage: '!points'
};
