const axios = require('axios');
const Discord = require('discord.js');

exports.run = async (Bot, message, args) => {

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (args.length === 0) return;

  let word = args[0];
  let url = process.env.WORDS_API + word;

  axios.get(url, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY
    }
  })
    .then((res, err) => {
      if (err) return message.channel.send('Something went wrong, please try again later. :(');
      let definitions = res.data.results;
      let syllables = res.data.syllables.list.join('-');
      let pronunciation = res.data.pronunciation.all ? res.data.pronunciation.all : res.data.pronunciation;
      let description = `pronunciation: ${pronunciation} | syllables: ${syllables}`;
      let maxDefinitions = definitions.slice(0, 3);

      let botEmbed = new Discord.RichEmbed()
        .setTitle(`"${res.data.word}"`)
        .setDescription(description)
        .setColor('#FFBFFA');

      maxDefinitions.forEach(obj => {
        botEmbed.addField(obj.partOfSpeech, obj.definition);
      });

      return message.channel.send(botEmbed);
    })
    .catch(error => {
      Bot.logger.error('[RapidAPI]', error);
      return message.channel.send(`${message.member.displayName}, that doesn't look like an English word. :thinking:`);
    });
};

exports.conf = {
  enabled: false,
  aliases: [],
  cooldown: 5,
  permitLevel: 0
};

exports.info = {
  name: 'define',
  description: 'Display the definition of an English word',
  category: 'default',
  usage: '!define <word>'
};
