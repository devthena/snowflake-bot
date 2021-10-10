const { MessageActionRow, MessageButton } = require('discord.js');
const { URLS } = require('../constants/botConfig');

module.exports = async interaction => {

  const row = new MessageActionRow()
    .addComponents(new MessageButton().setLabel('Commands').setStyle('LINK').setURL(URLS.COMMANDS))
    .addComponents(new MessageButton().setLabel('FAQ').setStyle('LINK').setURL(URLS.FAQ));

  try {
    await interaction.reply({
      content: 'Here are some links you might be interested in:',
      components: [ row ]
    });
  } catch(err) { console.error(err); }

};