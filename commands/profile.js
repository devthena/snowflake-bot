const Discord = require('discord.js');
const getExpInfo = require('../helpers/user/getExpInfo');
const getProfileCard = require('../helpers/user/getProfileCard');

/**
 * Displays the profile of a user
 * @param {ClientUser} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let member = server.members.get(message.member.id);
  if (!member) {
    member = {
      level: 1,
      exp: 0,
      points: 0,
      stars: 0
    };
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
  }

  let sortable = [];
  server.members.forEach((obj, id) => {
    if (obj.level > 0) sortable.push([id, obj.exp]);
  });
  sortable.sort((a, b) => b[1] - a[1]);

  let rank = 'n/a';
  sortable.forEach((arr, index) => {
    if (arr[0] === message.member.id) rank = index + 1;
  });

  const expObj = getExpInfo(member.level);

  const levelObj = {
    currentExp: member.exp - expObj.expPrev,
    maxExp: expObj.expNext,
    rank: rank
  }

  const profileCard = await getProfileCard(member, levelObj, message);
  const attachment = new Discord.MessageAttachment(profileCard, 'profile.png');
  message.channel.send(attachment);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'profile',
  description: 'Displays the profile of a user.',
  category: 'default',
  usage: '!profile'
};
