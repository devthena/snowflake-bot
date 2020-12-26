const botConfig = require('../../constants/botConfig');
const pokeConstants = require('../../constants/pokemon');
const reactEmbed = require('./reactEmbed');

/**
 * Update the message embed based on the user's reacted emoji
 * @param {Client} Bot
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Object} browseData
 */
const handleInteractBag = (Bot, reaction, user, browseData) => {

  const message = reaction.message;
  const embed = browseData.botEmbed;

  message.reactions.removeAll();

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.CANCEL) {

    clearTimeout(browseData.timer);
    Bot.browsing.delete(message.id);

    embed.spliceFields(0, 2);
    embed.setDescription(`${pokeConstants.UI.LINE}\nYour bag is now closed.\n${pokeConstants.UI.LINE}`);
    embed.setFooter('Tip: If you have enough gold, expand option is added.');

    return message.edit(embed);
  }

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.EXPAND) {

    const server = Bot.servers.get(message.guild.id);
    const member = server.members.get(user.id);
    const trainer = Bot.trainers.get(user.id);

    clearTimeout(browseData.timer);

    member.points -= pokeConstants.EXPAND_COSTS.BAG;
    server.members.set(user.id, member);
    Bot.servers.set(message.guild.id, server);

    trainer.bagLimit += pokeConstants.LIMIT_INC.BAG;
    Bot.trainers.set(user.id, trainer);

    const bagTimer = setTimeout(() => {

      message.reactions.removeAll();
      Bot.browsing.delete(message.id);

      embed.spliceFields(0, 2);
      embed.setDescription(`${pokeConstants.UI.LINE}\nYour bag is now closed.\n${pokeConstants.UI.LINE}`);
      embed.setFooter('Tip: You have 20s to react before your bag closes.');

      message.edit(embed);

    }, pokeConstants.COOLDOWNS.BAG);

    browseData.timer = bagTimer;

    let cost = `Cost: ${pokeConstants.EXPAND_COSTS.BAG}  |  Limit Increase: ${pokeConstants.LIMIT_INC.BAG}`;
    let embedFooter = `Expand your bag limit by reacting below.\n${cost}`;
    if (member.points < pokeConstants.EXPAND_COSTS.BAG) {
      embedFooter = `Expansion ${cost}`;
    }

    embed.spliceFields(0, 2);
    embed.addField('Total:', `${trainer.pokeballs.total} / ${trainer.bagLimit} Items`, true);
    embed.addField('Gold:', `${member.points} ${botConfig.CURRENCY}`, true);
    embed.setFooter(embedFooter);

    Bot.browsing.set(message.id, browseData);

    return message.edit(embed).then(sent => {
      if (member.points < pokeConstants.EXPAND_COSTS.BAG) reactEmbed('', sent);
      else reactEmbed('expand', sent);
    });
  }

};

module.exports = handleInteractBag;