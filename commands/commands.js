
exports.run = async (Bot, message) => {

  let commURL = 'http://snowflakebot.com/commands';
  let reply = `For information on the bot commands, visit this link: ${commURL}`;

  return message.channel.send(reply);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'commands',
  description: 'Sends the link of the commands page of the bot.',
  category: 'default',
  usage: '!commands'
};
