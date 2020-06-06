
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;
  if (!Bot.isTrue(server.mods.gameGamble)) return;

  let allIn = false;
  let gambleHalf = false;

  if (args[0] === 'all') allIn = true;
  else if (args[0] === 'half') gambleHalf = true;

  if (isNaN(args[0]) && !allIn && !gambleHalf) return message.channel.send('You can only gamble numbers, \'all\', or \'half\'.');

  let member = server.members.get(message.member.id);
  if (!member) {
    member = { points: 0 };
    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(`Sorry ${message.member.displayName}, you have no points to gamble. :neutral_face:`);
  }

  let points = parseInt(member.points, 10);

  if (allIn) {

    let result = Math.floor(Math.random() * 2);
    let allPoints = parseInt(member.points, 10);

    if (allPoints < 1) return message.channel.send(`Sorry ${message.member.displayName}, you have no points to gamble. :neutral_face:`);

    if (result) {
      member.points += allPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} won ${allPoints} points and now has ${member.points} points! :star:`);
    } else {
      member.points -= member.points;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} lost all of their points :sob:`);
    }
    return;

  } else if (gambleHalf) {

    let result = Math.floor(Math.random() * 2);
    let allPoints = parseInt(member.points, 10);

    if (allPoints < 1) return message.channel.send(`Sorry ${message.member.displayName}, you have no points to gamble. :neutral_face:`);

    let halfPoints = Math.round(allPoints / 2);

    if (result) {
      member.points += halfPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} won ${halfPoints} points and now has ${member.points} points! :sparkles:`);
    } else {
      member.points -= halfPoints;
      server.members.set(message.member.id, member);
      Bot.servers.set(message.guild.id, server);
      message.channel.send(`${message.member.displayName} lost half of their points and now has ${member.points} points. :fearful:`);
    }
    return;
  }

  let count = parseInt(args[0], 10);
  if (!count || count < 1) return message.channel.send('You should gamble at least 1 point, goob. :)');
  else if (count > 1000000) return message.channel.send('Ahhh that\'s too much! You can only gamble a max of 1000000.');

  if (points > 0) {

    if (count <= points) {

      let result = Math.floor(Math.random() * 2);

      if (result) {
        member.points += count;
        server.members.set(message.member.id, member);
        Bot.servers.set(message.guild.id, server);
        message.channel.send(`${message.member.displayName} won ${count} points and now has ${member.points} points! :sparkles:`);
      } else {
        member.points -= count;
        server.members.set(message.member.id, member);
        Bot.servers.set(message.guild.id, server);
        message.channel.send(`${message.member.displayName} lost ${count} points and now has ${member.points} points. :fearful:`);
      }

    } else {
      return message.channel.send(`Sorry ${message.member.displayName}, you don't have that many points to gamble. :neutral_face:`);
    }
  } else {
    return message.channel.send(`Sorry ${message.member.displayName}, you have no points to gamble. :neutral_face:`);
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
  description: 'Gamble member points.',
  category: 'default',
  usage: '!gamble <count>'
};
