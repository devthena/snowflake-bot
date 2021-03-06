const LOCAL = process.env.LOCAL;
const isTrue = require('../helpers/isTrue');

/**
 * Game: Magic 8 Ball
 * @param {Client} Bot 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;
  if (!isTrue(server.mods.game8Ball)) return;
  if (args.length === 0) return;

  let responseArray = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'For sure.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'No.',
    'Outlook not so good',
    'Very doubtful.'
  ];

  let randomNum = Math.floor(Math.random() * responseArray.length);
  let answer = responseArray[randomNum];

  return message.channel.send(`:8ball: says.. ${answer}`);
};

exports.conf = {
  enabled: !isTrue(LOCAL),
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: '8ball',
  description: 'Play a game of Magic 8 Ball.',
  category: 'games',
  usage: '!8ball <question>'
};
