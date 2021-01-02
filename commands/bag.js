const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const pokeConstants = require('../constants/pokemon');
const trainerConfig = require('../constants/trainerConfig');
const REACTS = require('../constants/pokemon').REACTS;
const reactEmbed = require('../helpers/pokemon/reactEmbed');

/**
 * Displays the amount of items a trainer has
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let isBrowsing = false;
  Bot.browsingBag.forEach(obj => { if (obj.trainerId === message.author.id) isBrowsing = true; });
  if (isBrowsing) {
    return message.delete().then(() => {
      message.channel.send(`${message.member.displayName}, your bag is already open!`)
    });
  }

  let trainer = Bot.trainers.get(message.member.id);
  if (!trainer) {
    trainer = JSON.parse(JSON.stringify(trainerConfig));
    Bot.trainers.set(message.author.id, trainer);
  }

  const member = server.members.get(message.author.id);

  let items = pokeConstants.UI.LINE;
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.POKEBALL)} Poke Ball: ${trainer.pokeballs.pokeball}`;
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.GREATBALL)} Great Ball: ${trainer.pokeballs.greatball}`;
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.ULTRABALL)} Ultra Ball: ${trainer.pokeballs.ultraball}`;
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.MASTERBALL)} Master Ball: ${trainer.pokeballs.masterball}`;
  items += `\n\n${pokeConstants.UI.LINE}`;

  let cost = `Cost: ${pokeConstants.EXPAND_COSTS.BAG}  |  Limit Increase: ${pokeConstants.LIMIT_INC.BAG}`;
  let embedFooter = `Expand your bag limit by reacting below.\n${cost}`;
  if (member.points < pokeConstants.EXPAND_COSTS.BAG) {
    embedFooter = `Expansion ${cost}`;
  }

  const botEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.member.displayName}'s Bag`)
    .setDescription(items)
    .setThumbnail(message.author.displayAvatarURL())
    .setColor(botConfig.COLOR)
    .addField('Total:', `${trainer.pokeballs.total} / ${trainer.bagLimit} Items`, true)
    .addField('Gold:', `${member.points} ${botConfig.CURRENCY}`, true)
    .setFooter(embedFooter);

  message.channel.send(botEmbed).then(sent => {

    if (member.points < pokeConstants.EXPAND_COSTS.BAG) reactEmbed('', sent);
    else reactEmbed('expand', sent);

    const bagTimer = setTimeout(() => {

      sent.reactions.removeAll();
      Bot.browsingBag.delete(sent.id);

      botEmbed.spliceFields(0, 2);
      botEmbed.setDescription(`${pokeConstants.UI.LINE}\nYour bag is now closed.\n${pokeConstants.UI.LINE}`);
      botEmbed.setFooter('Tip: You have 20s to react before your bag closes.');

      sent.edit(botEmbed);

    }, pokeConstants.COOLDOWNS.BAG);

    Bot.browsingBag.set(sent.id, {
      botEmbed: botEmbed,
      timer: bagTimer,
      trainerId: message.author.id
    });

  });
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 3,
  permitLevel: 'L1'
};

exports.info = {
  name: 'bag',
  description: 'Displays the amount of items a trainer has.',
  category: 'pokemon',
  usage: '!bag'
};