
const Discord = require('discord.js');

exports.run = async (Bot, message) => {

  let attachment = null;
  if (message.attachments.first()) {
    attachment = message.attachments.first().url;
  }

  let botEmbed = new Discord.MessageEmbed()
    .setImage(attachment)
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .setFooter(`Posted on ${message.createdAt}`)
    .setDescription(`${message.cleanContent}\n\nLink for [original message](${message.url}) in ${message.channel}`)
    .setColor('#FFBFFA');

  return message.channel.send(botEmbed);
};

exports.conf = {
  enabled: false,
  aliases: [],
  cooldown: 5,
  permitLevel: 10
};

exports.info = {
  name: 'test',
  description: 'Test command',
  category: 'default',
  usage: '!test'
};
