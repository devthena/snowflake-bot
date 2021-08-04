
const { MessageEmbed } = require('discord.js');
const { COLOR, CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
const sortByCoin = require('../helpers/sortByCoin');
const sortByRank = require('../helpers/sortByRank');

module.exports = (members, interaction) => {
  
  const type = interaction.options.getString('type');

  let sortable = sortByCoin(members);
  let title = `${CURRENCY} ----- Server Top Coin ----- ${CURRENCY}`;
  let description = `Here are the users with the highest ${CURRENCY_TEXT}!`;

  if(type === 'rank') {
    sortable = sortByRank(members);
    title = ':trident: ----- Server Top Rank ----- :trident:';
    description = `Here are the users with the highest level!`;
  }

  const botEmbed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(COLOR);

  const limit = Math.min(sortable.length, 5);
  for (let i = 0; i < limit; i++) {

    const arr = sortable[i];
    const user = interaction.guild.members.cache.get(arr[0]);
    const value = `Level: ${arr[1]} | Exp: ${arr[2]} | Gold: ${arr[3]}`;

    switch (i) {
      case 0:
        botEmbed.addField(`${i + 1}. ${user.displayName} :first_place:`, value);
        break;
      case 1:
        botEmbed.addField(`${i + 1}. ${user.displayName} :second_place:`, value);
        break;
      case 2:
        botEmbed.addField(`${i + 1}. ${user.displayName} :third_place:`, value);
        break;
      default:
        botEmbed.addField(`${i + 1}. ${user.displayName}`, value);
    }

  }

  return { embed: botEmbed };
};