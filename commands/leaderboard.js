
const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');

/**
 * Displays a list of members with the highest amount of points
 * @param {ClientUser} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let sortable = [];
  server.members.forEach((obj, id) => {
    if (obj.points > 0) sortable.push([id, obj.level, obj.points]);
  });

  sortable.sort((a, b) => {
    return b[2] - a[2];
  });

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  let botEmbed = new Discord.MessageEmbed()
    .setTitle(':trident: Server Leaderboard :trident:')
    .setDescription(`Here are the users with the most ${currencyText}!`)
    .setColor(botConfig.COLOR);

  let limit = Math.min(sortable.length, 5);
  for (let i = 0; i < limit; i++) {

    let arr = sortable[i];
    let user = message.guild.members.cache.get(arr[0]);
    let level = arr[1];
    let points = arr[2];
    const value = `${currency}: ${points} | Level: ${level}`;

    switch (i) {
      case 0:
        botEmbed.addField(`${i + 1}. ${user.displayName} :first_place:`, value);
        break;
      case 1:
        botEmbed.addField(`${i + 1}. ${user.displayName} :second_place:`, value);
        break;
      case 2:
        botEmbed.addField(`${i + 1}. ${user.displayName} :third_place:`, value);
        break;
      default:
        botEmbed.addField(`${i + 1}. ${user.displayName}`, value);
    }

  }

  return message.channel.send(botEmbed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'leaderboard',
  description: 'Display a list of members with the highest amount of points.',
  category: 'default',
  usage: '!leaderboard'
};
