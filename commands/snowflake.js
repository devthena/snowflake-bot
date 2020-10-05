const botConfig = require('../constants/botConfig');
const Discord = require('discord.js');

/**
 * Displays information about the bot
 * @param {ClientUser} Bot 
 * @param {Array} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  let botEmbed = new Discord.MessageEmbed()
    .setTitle('Bot Information')
    .setFooter('Note: This bot is exclusive to AthenaUS and AikoBliss servers.')
    .setDescription('I\'m made with ❤ by AthenaUS!')
    .setThumbnail(Bot.user.displayAvatarURL())
    .setColor(botConfig.COLOR)
    .addField('Created On', Bot.user.createdAt.toDateString(), true)
    .addField('Release', `version ${botConfig.VERSION}`, true);

  return message.channel.send(botEmbed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'snowflake',
  description: 'Displays information about the bot.',
  category: 'default',
  usage: '!snowflake'
};
