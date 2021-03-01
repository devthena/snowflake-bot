const LOCAL = process.env.LOCAL;
const Discord = require('discord.js');
const memberConfig = require('../constants/memberConfig');
const getProfileCard = require('../helpers/user/getProfileCard');
const getRank = require('../helpers/user/getRank');
const isTrue = require('../helpers/isTrue');

/**
 * Displays the profile of a user
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let memberId = message.member.id;
  let member = message.member;

  if (message.mentions.members.size > 0) {
    const mention = message.mentions.members.first()
    memberId = mention.id;
    member = await message.guild.members.fetch(mention.id);
  }

  let memberStats = server.members.get(memberId);
  if (!memberStats) {
    memberStats = JSON.parse(JSON.stringify(memberConfig));
    server.members.set(memberId, memberStats);
    Bot.servers.set(message.guild.id, server);
  }

  const rank = getRank(memberId, server.members);
  const profileCard = await getProfileCard(memberStats, rank, member);
  const attachment = new Discord.MessageAttachment(profileCard, 'profile.png');
  message.channel.send(attachment);
};

exports.conf = {
  enabled: !isTrue(LOCAL),
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'profile',
  description: 'Displays the profile of a user.',
  category: 'user',
  usage: '!profile'
};
