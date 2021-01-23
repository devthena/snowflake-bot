const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const pokeConstants = require('../constants/pokemon');
const trainerConfig = require('../constants/trainerConfig');
const REACTS = require('../constants/pokemon').REACTS;
const SHOP_PRICES = require('../constants/pokemon').SHOP_PRICES;

/**
 * Displays the items available to be bought or sold by the user
 * @param {Client} Bot 
 * @param {Message} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let trainer = Bot.trainers.get(message.member.id);
  if (!trainer) {
    trainer = JSON.parse(JSON.stringify(trainerConfig));
    Bot.trainers.set(message.author.id, trainer);
  }

  const member = server.members.get(message.author.id);

  let items = `Use: \`!buy <item ID> <amount>\`\n${message.member.displayName}'s Gold: ${member.points} ${botConfig.CURRENCY}\n`;
  
  items += pokeConstants.UI.LINE;
  
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.POKEBALL)} Poke Ball -- \`ID: ${REACTS.POKEBALL}\``;
  items += `\nCost: \`${SHOP_PRICES.pokeball}\` ${botConfig.CURRENCY} | Limit: 5 per restock`;
  
  items += `\n\n${Bot.pokemonEmojis.get(REACTS.GREATBALL)} Great Ball -- \`ID: ${REACTS.GREATBALL}\``;
  items += `\nCost: \`${SHOP_PRICES.greatball}\` ${botConfig.CURRENCY} | Limit: 3 per restock`;

  items += `\n\n${Bot.pokemonEmojis.get(REACTS.ULTRABALL)} Ultra Ball -- \`ID: ${REACTS.ULTRABALL}\``;
  items += `\nCost: \`${SHOP_PRICES.ultraball}\` ${botConfig.CURRENCY} | Limit: 1 per restock`;

  items += `\n\n${Bot.pokemonEmojis.get(REACTS.MASTERBALL)} Master Ball -- \`ID: ${REACTS.MASTERBALL}\``;
  items += `\nCost: \`${SHOP_PRICES.masterball}\` ${botConfig.CURRENCY} | Limit: 1 per day`;

  items += `\n\n${pokeConstants.UI.LINE}`;

  let restockTime = '1 HR 17 MIN';
  let embedFooter = `NEXT SHOP RESTOCK: ${restockTime}`;

  const botEmbed = new Discord.MessageEmbed()
    .setTitle('Welcome to the Poke Mart!')
    .setThumbnail(pokeConstants.SHOP_ICON_URL)
    .setDescription(items)
    .setColor(botConfig.COLOR)
    .setFooter(embedFooter);

  message.channel.send(botEmbed);
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 3,
  permitLevel: 'L1'
};

exports.info = {
  name: 'shop',
  description: 'Displays the items available to be bought or sold by the user.',
  category: 'pokemon',
  usage: '!shop'
};
