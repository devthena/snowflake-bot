const botConfig = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

/**
 * Give an amount of points to a specific member
 * @param {ClientUser} Bot 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  const notices = {
    invalidInput: `${message.member.displayName}, you can only give ${currencyText}, please enter an amount. :wink:`,
    invalidMax: `Ahhh that's too much! You can only give a max of 10000 ${currency} at a time.`,
    noBot: `Sorry ${message.member.displayName}, I have no use for ${currencyText}. Please keep it! :snowflake:`,
    noPoints: `Sorry ${message.member.displayName}, you have no ${currencyText} to give. :neutral_face:`,
    noTag: `${message.member.displayName}, you have to tag the person you want to give your ${currencyText} to. :wink:`,
    notEnough: `Sorry ${message.member.displayName}, you don't have that many ${currencyText} to give. :neutral_face:`
  };

  if (message.mentions.members.size === 0) {
    return message.channel.send(notices.noTag);
  }

  if (isNaN(args[1])) return message.channel.send(notices.invalidInput);

  let amount = parseInt(args[1], 10);
  if (amount <= 0) return message.channel.send(`${message.member.displayName}, you can't give ${amount} ${currency}, goob. :wink:`);

  let giver = server.members.get(message.member.id);
  if (!giver) {
    giver = JSON.parse(JSON.stringify(memberConfig));
    server.members.set(message.member.id, giver);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(notices.noPoints);
  }

  if (giver.points < amount && message.member.id !== message.guild.ownerID) {
    return message.channel.send(notices.notEnough);
  }

  if (amount > 10000) return message.channel.send(notices.invalidMax);

  let recipient = message.mentions.members.first();
  let recipientCopy = `${recipient.displayName}`;

  if (message.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  if (Bot.user.id === recipient.id) {
    return message.channel.send(notices.noBot);
  }

  if (message.member.id !== message.guild.ownerID) {
    giver.points -= amount;
    server.members.set(message.member.id, giver);
  }

  let member = server.members.get(recipient.id);
  if (!member) member = JSON.parse(JSON.stringify(memberConfig));

  member.points += amount;

  server.members.set(recipient.id, member);
  Bot.servers.set(message.guild.id, server);
  return message.channel.send(`${message.member.displayName}, you have given ${amount} ${currency} to ${recipientCopy}.`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'give',
  description: 'Give an amount of points to a specific member.',
  category: 'user',
  usage: '!give <@user> <amount>'
};
