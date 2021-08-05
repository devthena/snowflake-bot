const { MessageEmbed } = require('discord.js');
const { COLOR, VERSION } = require('../constants/botConfig');

module.exports = botUser => {

  let botEmbed = new MessageEmbed()
    .setTitle('Bot Information')
    .setFooter('Note: This bot is exclusive to AthenaUS and AikoBliss servers.')
    .setDescription('I\'m made with ❤ by AthenaUS!')
    .setThumbnail(botUser.displayAvatarURL())
    .setColor(COLOR)
    .addField('Created On', botUser.createdAt.toDateString(), true)
    .addField('Release', `version ${VERSION}`, true);

  return { embed: botEmbed };

};