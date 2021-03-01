const LOCAL = process.env.LOCAL;
const botConfig = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');
const weightedRandom = require('../helpers/weightedRandom');

/**
 * Game: Double or Nothing
 * @param {Client} Bot 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;
  if (!isTrue(server.mods.gameGamble)) return;

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  const notices = {
    invalidInput: `You can only gamble an amount of your ${currencyText}, 'all', or 'half'. :wink:`,
    invalidNegative: `You should gamble at least 1 ${currency}, goob. :wink:`,
    lostAll: `${message.member.displayName} lost all of their ${currencyText}. :money_with_wings:`,
    noPoints: `Sorry ${message.member.displayName}, you have no ${currencyText} to gamble. :neutral_face:`,
    notEnough: `Sorry ${message.member.displayName}, you don't have that many ${currencyText} to gamble. :neutral_face:`
  };

  let allIn = false;
  let gambleHalf = false;

  const probability = { win: (server.settings.gamblePercent / 100), loss: (1 - (server.settings.gamblePercent / 100)) };

  if (args[0] === 'all') allIn = true;
  else if (args[0] === 'half') gambleHalf = true;

  if (isNaN(args[0]) && !allIn && !gambleHalf) return message.channel.send(notices.invalidInput);

  let member = server.members.get(message.member.id);
  if (!member) {
    member = JSON.parse(JSON.stringify(memberConfig));
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(notices.noPoints);
  }

  const points = parseInt(member.points, 10);

  if (points < 1) return message.channel.send(notices.noPoints);

  const result = weightedRandom(probability);

  if (allIn) {

    if (result === 'win') {
      member.points += points;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      return message.channel.send(`${message.member.displayName} won ${points} :moneybag: and now has ${member.points} ${currency}! :sparkles:`);
    }
    
    member.points = 0;
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(notices.lostAll);

  }
  
  if (gambleHalf) {

    const halfPoints = Math.round(points / 2);

    if (result === 'win') {
      member.points += halfPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      return message.channel.send(`${message.member.displayName} won ${halfPoints} :moneybag: and now has ${member.points} ${currency}!`);
    }
    
    member.points -= halfPoints;
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(`${message.member.displayName} lost ${halfPoints} :money_with_wings: and now has ${member.points} ${currency}.`);
  }

  let count = parseInt(args[0], 10);
  if (!count || count < 1) return message.channel.send(notices.invalidNegative);

  if (points > 0) {

    if (count <= points) {

      if (result === 'win') {
        member.points += count;
        server.members.set(message.member.id, member);
        Bot.servers.set(message.guild.id, server);
        return message.channel.send(`${message.member.displayName} won ${count} :moneybag: and now has ${member.points} ${currency}!`);
      }
      
      member.points -= count;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      return message.channel.send(`${message.member.displayName} lost ${count} :money_with_wings: and now has ${member.points} ${currency}.`);
    }
    
    return message.channel.send(notices.notEnough);
  }
  
  return message.channel.send(notices.noPoints);
};

exports.conf = {
  enabled: !isTrue(LOCAL),
  aliases: [],
  cooldown: 3,
  permitLevel: 0
};

exports.info = {
  name: 'gamble',
  description: 'Play a game of double or nothing using a given amount of points.',
  category: 'games',
  usage: '!gamble <amount>'
};
