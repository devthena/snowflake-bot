
const { MessageEmbed } = require('discord.js');
const { CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
const { BLUE } = require('../constants/discordColors');

module.exports = async (Bot, interaction) => {
  
  const type = interaction.options.getString('type');

  let topFive = null;
  let title = `${CURRENCY} ----- Server Top Coin ----- ${CURRENCY}`;
  let description = `Here are the users with the highest ${CURRENCY_TEXT}!`;

  switch(type) {
    case 'rank':
      topFive = await Bot.db.collection('members')
        .find({ serverId: interaction.guildId })
        .sort({ level: -1, exp: -1 })
        .limit(5).toArray();
      title = ':trident: ----- Server Top Rank ----- :trident:';
      description = `Here are the users with the highest level!`;
      break;
    default:
      topFive = await Bot.db.collection('members')
        .find({ serverId: interaction.guildId })
        .sort({ points: -1 })
        .limit(5).toArray();
  }

  const botEmbed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(BLUE);

  topFive.forEach((top, i) => {

    const member = interaction.guild.members.cache.get(top.userId);

    let value = `Gold: ${ top.points }`;
    if(type === 'rank') value = `Level: ${ top.level } | Exp: ${ top.exp }`;
    
    switch (i) {
      case 0:
        botEmbed.addField(`${i + 1}. ${member.displayName} :first_place:`, value);
        break;
      case 1:
        botEmbed.addField(`${i + 1}. ${member.displayName} :second_place:`, value);
        break;
      case 2:
        botEmbed.addField(`${i + 1}. ${member.displayName} :third_place:`, value);
        break;
      default:
        botEmbed.addField(`${i + 1}. ${member.displayName}`, value);
    }
  });

  try {
    await interaction.reply({ embeds: [ botEmbed ] });
  } catch(err) { console.error(err); }
};