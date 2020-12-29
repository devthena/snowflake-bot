const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const pokeConstants = require('../constants/pokemon');
const trainerConfig = require('../constants/trainerConfig');
const reactEmbed = require('../helpers/pokemon/reactEmbed');

/**
 * Displays the pokemon collection of the user
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const notices = {
    noMultipleBrowse: `${message.member.displayName}, your pokedex is already open!`,
    noPokemon: `${message.member.displayName}, you haven't caught any pokemon yet! You can do \`!x\` to explore in the wild.`
  };

  let isBrowsing = false;
  Bot.browsingDex.forEach(obj => { if (obj.trainerId === message.author.id) isBrowsing = true; });
  if (isBrowsing) return message.delete().then(() => message.channel.send(notices.noMultipleBrowse));

  let trainer = Bot.trainers.get(message.member.id);
  if (!trainer) {
    trainer = JSON.parse(JSON.stringify(trainerConfig));
    Bot.trainers.set(message.author.id, trainer);
  }

  if (trainer.dexTotal === 0) return message.channel.send(notices.noPokemon);

  const member = server.members.get(message.author.id);

  let collection = [];
  Object.values(trainer.pokedex).forEach(gen => {
    for (let key in gen) {
      if (gen.hasOwnProperty(key)) {
        if (gen[key].total > 0) collection.push({ id: key, ...gen[key] });
      }
    }
  });

  collection.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

  let totalPages = Math.ceil(trainer.dexTotal / pokeConstants.PAGE_LIMIT);
  let items = `Page \`1 of ${totalPages}\` | Unique: \` ${trainer.obtainedTotal} \`\n${pokeConstants.UI.LINE}`;
  let filteredCollection = collection.slice(0, pokeConstants.PAGE_LIMIT);

  filteredCollection.forEach(obj => {
    items += `\n| \` ${obj.id} \` - ${obj.name} : ${obj.total}`;
  });

  items += `\n${pokeConstants.UI.LINE}`;

  let cost = `Cost: ${pokeConstants.EXPAND_COSTS.DEX}  |  Limit Increase: ${pokeConstants.LIMIT_INC.DEX}`;
  let embedFooter = `Expand your pokedex limit by reacting below.\n${cost}`;
  if (member.points < pokeConstants.EXPAND_COSTS.DEX) {
    embedFooter = `Expansion ${cost}`;
  }

  const botEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.member.displayName}'s Pokedex`)
    .setDescription(items)
    .setThumbnail(message.author.displayAvatarURL())
    .setColor(botConfig.COLOR)
    .addField('Total:', `${trainer.dexTotal} / ${trainer.dexLimit}`, true)
    .addField('Gold:', `${member.points} ${botConfig.CURRENCY}`, true)
    .setFooter(embedFooter);

  message.channel.send(botEmbed).then(sent => {

    if (member.points < pokeConstants.EXPAND_COSTS.DEX) reactEmbed('', sent);
    else reactEmbed('dex', sent, { page: 1, totalPages });

    const dexTimer = setTimeout(() => {

      sent.reactions.removeAll();
      Bot.browsingDex.delete(sent.id);

      botEmbed.spliceFields(0, 2);
      botEmbed.setDescription(`${pokeConstants.UI.LINE}\nYour pokedex is now closed.\n${pokeConstants.UI.LINE}`);
      botEmbed.setFooter('Tip: You have 20s to react before your pokedex closes.');

      sent.edit(botEmbed);

    }, pokeConstants.COOLDOWNS.DEX);

    Bot.browsingDex.set(sent.id, {
      botEmbed: botEmbed,
      collection: collection,
      page: 1,
      timer: dexTimer,
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
  name: 'dex',
  description: 'Displays the pokemon collection of the user.',
  category: 'pokemon',
  usage: '!dex'
};
