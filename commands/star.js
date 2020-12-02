const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Adds a star (as a form of endorsement) to a mentioned user
 * @param {ClientUser} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const notices = {
    invalidMax: `${message.member.displayName} you can only give one star per day. :)`,
    invalidSelf: `${message.member.displayName}, you can't give yourself a star, goob. :)`,
    noTag: `${message.member.displayName}, you have to tag the person you want to give a star to. :)`
  };

  if (message.mentions.members.size === 0) {
    return message.channel.send(notices.noTag);
  }

  const member = server.members.get(message.member.id);
  const mention = message.mentions.members.first();
  const today = new Date().getDay() + 1;

  if (message.member.id === mention.id) return message.channel.send(notices.invalidSelf);
  if (member.lastStar === today) return message.channel.send(notices.invalidMax);

  let recipient = server.members.get(mention.id);
  if (!recipient) recipient = JSON.parse(JSON.stringify(memberConfig));

  member.lastStar = today;
  server.members.set(message.member.id, member);

  recipient.stars += 1;
  recipient.exp += expAddends.starred;
  const updatedRecipient = updateLevel(recipient, mention.displayName, message.guild.channels.cache);
  server.members.set(mention.id, updatedRecipient);

  Bot.servers.set(message.guild.id, server);

  message.channel.send(`${message.member.displayName} has given a star to ${mention.displayName}! :sparkles:`);
};

exports.conf = {
  enabled: true,
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
