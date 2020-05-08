
exports.run = async (Bot, message, args) => {

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (message.mentions.members.size === 0) {
    return message.channel.send(`${message.member.displayName}, you have to tag the person you want to give your points to. :wink:`);
  }

  if (isNaN(args[1])) return message.channel.send(`${message.member.displayName}, you can only give points, please enter an amount.`);

  let amount = parseInt(args[1], 10);
  if (amount <= 0) return message.channel.send(`${message.member.displayName}, you can't give ${amount} points, goob. :)`);

  let giver = server.members.get(message.member.id);
  if (!giver) {
    giver = { points: 0 };
    server.members.set(message.member.id, giver);
    Bot.servers.set(message.guild.id, server);
    return message.channel.send(`${message.member.displayName}, you have no points to give. :neutral_face:`);
  }

  if (giver.points < amount && message.member.id !== message.guild.ownerID) {
    return message.channel.send(`${message.member.displayName}, you don't have that many points to give. :neutral_face:`);
  }

  if (amount > 10000) return message.channel.send('Ahhh that\'s too much! You can only give a max of 1000 points at a time.');

  let recipient = message.mentions.members.first();
  let member = server.members.get(recipient.id);
  let pointCopy = `${amount} points`;
  let recipientCopy = `${recipient.displayName}`;

  if (message.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  if (Bot.user.id === recipient.id) {
    return message.channel.send(`${message.member.displayName}, thanks, but I stopped accepting points from users. :snowflake:`);
  }

  if (message.member.id !== message.guild.ownerID) {
    giver.points -= amount;
    server.members.set(message.member.id, giver);
    pointCopy = `${amount} of your points`;
  }

  if (!member) member = { points: amount };
  else member.points += amount;

  server.members.set(recipient.id, member);
  Bot.servers.set(message.guild.id, server);
  return message.channel.send(`${message.member.displayName}, you have given ${pointCopy} to ${recipientCopy}`);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'give',
  description: 'Give points to specific users.',
  category: 'default',
  usage: '!give <user> <amount>'
};
