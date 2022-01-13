const { MessageEmbed } = require('discord.js');
const { COLOR, VERSION } = require('../constants/botConfig');

module.exports = async (Bot, interaction) => {

  const botEmbed = new MessageEmbed()
    .setTitle('Bot Information')
    .setFooter('Note: Snowflake is a private bot and is not created for public use.')
    .setDescription('I\'m made with ❤ by AthenaUS!')
    .setThumbnail(Bot.user.displayAvatarURL())
    .setColor(COLOR)
    .addField('Created On', Bot.user.createdAt.toDateString(), true)
    .addField('Release', `version ${VERSION}`, true);

  try {
    await interaction.reply({ embeds: [ botEmbed ] });
  } catch(err) { console.error(err); }

};