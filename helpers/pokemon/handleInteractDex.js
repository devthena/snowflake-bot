const botConfig = require('../../constants/botConfig');
const pokeConstants = require('../../constants/pokemon');
const reactEmbed = require('./reactEmbed');

/**
 * Update the message embed based on the user's reacted emoji
 * @param {Client} Bot
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Object} data
 */
const handleInteractDex = (Bot, reaction, user, data) => {

  const message = reaction.message;
  const embed = data.botEmbed;

  message.reactions.removeAll();

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.CANCEL) {

    clearTimeout(data.timer);
    Bot.browsingDex.delete(message.id);

    embed.spliceFields(0, 2);
    embed.setDescription(`${pokeConstants.UI.LINE}\nYour pokedex is now closed.\n${pokeConstants.UI.LINE}`);
    embed.setFooter('Tip: If you have enough gold, expand option is added.');

    return message.edit(embed);
  }

  const server = Bot.servers.get(message.guild.id);
  const member = server.members.get(user.id);
  const trainer = Bot.trainers.get(user.id);

  let items = '';
  let totalPages = Math.ceil(trainer.dexTotal / pokeConstants.PAGE_LIMIT);
  let updateEmbed = false;

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.EXPAND) {

    clearTimeout(data.timer);

    member.points -= pokeConstants.EXPAND_COSTS.DEX;
    server.members.set(user.id, member);
    Bot.servers.set(message.guild.id, server);

    trainer.dexLimit += pokeConstants.LIMIT_INC.DEX;
    Bot.trainers.set(user.id, trainer);

    updateEmbed = true;

  } else if (reaction.emoji.name === pokeConstants.REACTS_UNI.NEXT) {

    clearTimeout(data.timer);

    const sliceIndex = data.page * pokeConstants.PAGE_LIMIT;
    data.page += 1;

    items = `Page \`${data.page} of ${totalPages}\` | Unique: \` ${trainer.obtainedTotal} \`\n${pokeConstants.UI.LINE}`;
    const filteredCollection = data.collection.slice(sliceIndex, sliceIndex + pokeConstants.PAGE_LIMIT);

    filteredCollection.forEach(obj => {
      items += `\n| \` ${obj.id} \` - ${obj.name} : ${obj.total}`;
    });

    items += `\n${pokeConstants.UI.LINE}`;

    updateEmbed = true;

  } else if (reaction.emoji.name === pokeConstants.REACTS_UNI.PREV) {

    clearTimeout(data.timer);

    data.page -= 1;
    const sliceIndex = (data.page - 1) * pokeConstants.PAGE_LIMIT;

    items = `Page \`${data.page} of ${totalPages}\` | Unique: \` ${trainer.obtainedTotal} \`\n${pokeConstants.UI.LINE}`;
    const filteredCollection = data.collection.slice(sliceIndex, sliceIndex + pokeConstants.PAGE_LIMIT);

    filteredCollection.forEach(obj => {
      items += `\n| \` ${obj.id} \` - ${obj.name} : ${obj.total}`;
    });

    items += `\n${pokeConstants.UI.LINE}`;

    updateEmbed = true;

  }

  if (updateEmbed) {

    const dexTimer = setTimeout(() => {

      message.reactions.removeAll();
      Bot.browsingDex.delete(message.id);

      embed.spliceFields(0, 2);
      embed.setDescription(`${pokeConstants.UI.LINE}\nYour pokedex is now closed.\n${pokeConstants.UI.LINE}`);
      embed.setFooter('Tip: You have 20s to react before your pokedex closes.');

      message.edit(embed);

    }, pokeConstants.COOLDOWNS.DEX);

    data.timer = dexTimer;

    let cost = `Cost: ${pokeConstants.EXPAND_COSTS.DEX}  |  Limit Increase: ${pokeConstants.LIMIT_INC.DEX}`;
    let embedFooter = `Expand your pokedex limit by reacting below.\n${cost}`;
    if (member.points < pokeConstants.EXPAND_COSTS.DEX) {
      embedFooter = `Expansion ${cost}`;
    }

    embed.setDescription(items);
    embed.spliceFields(0, 2);
    embed.addField('Total:', `${trainer.dexTotal} / ${trainer.dexLimit}`, true);
    embed.addField('Gold:', `${member.points} ${botConfig.CURRENCY}`, true);
    embed.setFooter(embedFooter);

    Bot.browsingDex.set(message.id, data);

    return message.edit(embed).then(sent => {
      if (member.points < pokeConstants.EXPAND_COSTS.DEX) reactEmbed('', sent);
      else reactEmbed('dex', sent, { page: data.page, totalPages });
    });

  }

};

module.exports = handleInteractDex;