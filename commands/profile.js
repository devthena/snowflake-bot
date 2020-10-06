const Discord = require('discord.js');
const getProfileCard = require('../helpers/user/getProfileCard');
const getRank = require('../helpers/user/getRank');

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

  const rank = getRank(message.member.id, server.members);
  const profileCard = await getProfileCard(member, rank, message);
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
