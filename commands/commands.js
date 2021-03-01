const LOCAL = process.env.LOCAL;
const botConfig = require('../constants/botConfig');
const isTrue = require('../helpers/isTrue');

/**
 * Displays the link of the Bot commands page
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {
  if (!message.guild.available) return;
  let reply = `For information on the bot commands, visit this link: ${botConfig.COMMANDS_URL}`;
  return message.channel.send(reply);
};

exports.conf = {
  enabled: !isTrue(LOCAL),
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'commands',
  description: 'Displays the link of the Bot commands page.',
  category: 'default',
  usage: '!commands'
};
