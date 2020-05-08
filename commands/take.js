
exports.run = async (Bot, message, args) => {

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (message.mentions.members.size === 0) {
    return message.channel.send(`${message.member.displayName}, you have to tag the person you want to take points from. :wink:`);
  }

  if (isNaN(args[1])) return message.channel.send(`${message.member.displayName}, you can only take points, please enter an amount.`);

  let amount = parseInt(args[1], 10);
  if (amount <= 0) return message.channel.send(`${message.member.displayName}, you can't take ${amount} points, goob. :)`);

  let recipient = message.mentions.members.first();
  let member = server.members.get(recipient.id);
  let recipientCopy = `${recipient.displayName}`;

  if (message.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  if (!member) {
    member = { points: 0 };
    server.members.set(recipient.id, member);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(`${message.member.displayName}, ${recipientCopy} already has 0 points. :neutral_face:`);
  }

  if (member.points === 0) return message.channel.send(`${message.member.displayName}, ${recipientCopy} already has 0 points. :neutral_face:`);

  if (amount > member.points) amount = member.points;

  let pointCopy = `${amount} points`;
  member.points -= amount;
  server.members.set(recipient.id, member);

  Bot.servers.set(message.guild.id, server);
  return message.channel.send(`${message.member.displayName}, you have taken ${pointCopy} from ${recipientCopy}`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 10
};

exports.info = {
  name: 'take',
  description: 'Take points from specific users.',
  category: 'default',
  usage: '!take <user> <amount>'
};
