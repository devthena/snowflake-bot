
const Discord = require('discord.js');

exports.run = async (Bot, message) => {

  let d = new Date(Bot.user.createdTimestamp);
  let createdDate = d.toDateString();

  let botEmbed = new Discord.RichEmbed()
    .setTitle('Bot Information')
    .setFooter('Note: This bot is exclusive to AthenaUS and AikoBliss servers.')
    .setDescription('I\'m made with ❤ by AthenaUS!')
    .setThumbnail(Bot.user.displayAvatarURL)
    .setColor('#FFBFFA')
    .addField('Created On', createdDate, true)
    .addField('Beta Build', 'Version 0.9.0', true);

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
  description: 'Display bot information.',
  category: 'default',
  usage: '!snowflake'
};
