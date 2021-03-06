const LOCAL = process.env.LOCAL;
const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Adds a star (as a form of endorsement) to a mentioned user
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const notices = {
    invalidMax: `${message.member.displayName}, you can only give one star per day.`,
    invalidSelf: `${message.member.displayName}, you can't give yourself a star, goob.`,
    noStar: `${message.member.displayName}, you've already given a star for today.`,
    noTag: `${message.member.displayName}, you have to tag the person you want to give a star to.`,
    starAvailable: `${message.member.displayName}, you can give someone a star today. :sparkles:`
  };

  const member = server.members.get(message.member.id);
  const now = new Date();
  const today = `${now.getMonth()}-${now.getDay()}`;

  if (message.mentions.members.size === 0) {

    const args = message.content.slice(botConfig.PREFIX.length).trim().split(/ +/g);
    const hasGivenStarMessage = member.lastStar === today ? notices.noStar : notices.starAvailable;

    if(args[1] === 'check') return message.channel.send(hasGivenStarMessage);

    return message.channel.send(notices.noTag);
  }

  const mention = message.mentions.members.first();

  if (message.member.id === mention.id) return message.channel.send(notices.invalidSelf);
  if (member.lastStar === today) return message.channel.send(notices.invalidMax);

  let recipient = server.members.get(mention.id);
  if (!recipient) recipient = JSON.parse(JSON.stringify(memberConfig));

  member.lastStar = today;
  server.members.set(message.member.id, member);

  recipient.stars += 1;
  recipient.exp += expAddends.starred;
  const updatedRecipient = updateLevel(recipient, mention.displayName, message.guild.channels);
  server.members.set(mention.id, updatedRecipient);

  Bot.servers.set(message.guild.id, server);

  let botEmbed = new Discord.MessageEmbed()
    .setTitle('Daily Star Sent!')
    .setDescription(`${mention.displayName} got a star from ${message.member.displayName}!\n\nThey also got +100 EXP as a bonus. :sparkles:`)
    .setColor(botConfig.COLOR)
    .setFooter(`Star given on ${now}`);

  return message.channel.send(botEmbed);
};

exports.conf = {
  enabled: !isTrue(LOCAL),
  aliases: [],
  cooldown: 5,
  permitLevel: 'L2'
};

exports.info = {
  name: 'star',
  description: 'Gives a star (as a form of endorsement) to a mentioned user.',
  category: 'user',
  usage: '!star'
};
