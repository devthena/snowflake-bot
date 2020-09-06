
const Discord = require('discord.js');

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
  server.members.forEach((pointObj, id) => {
    if (pointObj.points > 0) sortable.push([id, pointObj.points]);
  });

  sortable.sort((a, b) => {
    return b[1] - a[1];
  });

  let botEmbed = new Discord.MessageEmbed()
    .setTitle(':trident: Server Leaderboard :trident:')
    .setDescription('Here are the users with the most points!')
    .setColor('#FFBFFA');

  let limit = Math.min(sortable.length, 5);
  for (let i = 0; i < limit; i++) {

    let arr = sortable[i];
    let user = message.guild.members.cache.get(arr[0]);
    let points = arr[1];

    if (i == 0) {
      botEmbed.addField(`${i + 1}. ${user.displayName} :first_place:`, `Points: ${points}`);
    } else if (i == 1) {
      botEmbed.addField(`${i + 1}. ${user.displayName} :second_place:`, `Points: ${points}`);
    } else if (i == 2) {
      botEmbed.addField(`${i + 1}. ${user.displayName} :third_place:`, `Points: ${points}`);
    } else {
      botEmbed.addField(`${i + 1}. ${user.displayName}`, `Points: ${points}`);
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
