const isTrue = require('../helpers/isTrue');
const botConfig = require('../constants/botConfig');

/**
 * Game: Double or Nothing
 * @param {ClientUser} Bot 
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
    invalidMax: `Ahhh that's too much! You can only gamble a max of 100000 ${currency}.`,
    invalidNegative: `You should gamble at least 1 ${currency}, goob. :wink:`,
    lostAll: `${message.member.displayName} lost all of their ${currencyText}. :sob:`,
    noPoints: `Sorry ${message.member.displayName}, you have no ${currencyText} to gamble. :frowning:`,
    notEnough: `Sorry ${message.member.displayName}, you don't have that many ${currencyText} to gamble. :neutral_face:`
  };

  let allIn = false;
  let gambleHalf = false;

  if (args[0] === 'all') allIn = true;
  else if (args[0] === 'half') gambleHalf = true;

  if (isNaN(args[0]) && !allIn && !gambleHalf) return message.channel.send(notices.invalidInput);

  let member = server.members.get(message.member.id);
  if (!member) {
    member = { points: 0 };
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(notices.noPoints);
  }

  let points = parseInt(member.points, 10);

  if (allIn) {

    let result = Math.floor(Math.random() * 2);
    let allPoints = parseInt(member.points, 10);

    if (allPoints < 1) return message.channel.send(notices.noPoints);

    if (result) {
      member.points += allPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} won ${allPoints} ${currency} and now has ${member.points} ${currency}! :sparkles:`);
    } else {
      member.points -= member.points;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(notices.lostAll);
    }
    return;

  } else if (gambleHalf) {

    let result = Math.floor(Math.random() * 2);
    let allPoints = parseInt(member.points, 10);

    if (allPoints < 1) return message.channel.send(notices.noPoints);

    let halfPoints = Math.round(allPoints / 2);

    if (result) {
      member.points += halfPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} won ${halfPoints} ${currency} and now has ${member.points} ${currency}!`);
    } else {
      member.points -= halfPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} lost half of their ${currencyText} and now has ${member.points} ${currency}.`);
    }
    return;
  }

  let count = parseInt(args[0], 10);
  if (!count || count < 1) return message.channel.send(notices.invalidNegative);
  else if (count > 100000) return message.channel.send(notices.invalidMax);

  if (points > 0) {

    if (count <= points) {

      let result = Math.floor(Math.random() * 2);

      if (result) {
        member.points += count;
        server.members.set(message.member.id, member);
        Bot.servers.set(message.guild.id, server);
        message.channel.send(`${message.member.displayName} won ${count} ${currency} and now has ${member.points} ${currency}!`);
      } else {
        member.points -= count;
        server.members.set(message.member.id, member);
        Bot.servers.set(message.guild.id, server);
        message.channel.send(`${message.member.displayName} lost ${count} ${currency} and now has ${member.points} ${currency}.`);
      }

    } else {
      return message.channel.send(notices.notEnough);
    }
  } else {
    return message.channel.send(notices.noPoints);
  }
};

exports.conf = {
  enabled: true,
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
