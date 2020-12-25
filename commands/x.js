const aikoId = process.env.AIKO_SERVER_ID;
const athenaId = process.env.ATHENA_SERVER_ID;
const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const pokeConstants = require('../constants/pokemon');
const trainerConfig = require('../constants/trainerConfig');
const randomIndex = require('../helpers/randomIndex');
const reactX = require('../helpers/pokemon/reactX');
const weightedRandom = require('../helpers/weightedRandom');

/**
 * Explore the wild to find pokemon
 * @param {Client} Bot 
 * @param {Array} message 
 */
exports.run = async (Bot, message) => {

  if (!message.guild.available) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  const notices = {
    invalidMax: `${message.member.displayName}, you have no more space in your dex to add more pokemon. You can either expand your !dex limit or !release one of your pokemon.`,
    noMultipleExplore: `${message.member.displayName}, there's still a wild pokemon in front of you! React above to catch it or run away.`,
    noPokeballs: `${message.member.displayName}, you are out of pokeballs! :( You can check the !shop if they have more stock you can buy.`
  };

  if (Bot.exploring.has(message.author.id)) return message.channel.send(notices.noMultipleExplore);

  let trainer = Bot.trainers.get(message.author.id);
  if (!trainer) trainer = JSON.parse(JSON.stringify(trainerConfig));

  if (trainer.dexTotal === trainer.dexLimit) return message.channel.send(notices.invalidMax);
  if (!trainer.pokeballs.total) return message.channel.send(notices.noPokeballs);

  const member = server.members.get(message.author.id);
  const rngRarity = member.level > 1 ? weightedRandom(pokeConstants.WEIGHTED_RARITY) : 'C';

  const nocturnalGroup = Bot.pokemonGroups.get('N');
  const rarityGroup = Bot.pokemonGroups.get(rngRarity);

  let filteredRarityGroup = rarityGroup;
  switch (message.guild.id) {
    case aikoId:
      filteredRarityGroup = rarityGroup.filter(id => !pokeConstants.EXCLUSIVES[athenaId].includes(id));
      break;
    case athenaId:
      filteredRarityGroup = rarityGroup.filter(id => !pokeConstants.EXCLUSIVES[athenaId].includes(id));
      break;
  }

  const hour = new Date().getHours();
  const night = hour > pokeConstants.EVENING_HOUR || hour < pokeConstants.MORNING_HOUR;
  const activeGroup = night ? filteredRarityGroup : filteredRarityGroup.filter(id => !nocturnalGroup.includes(id));

  const rngIndex = randomIndex(0, activeGroup.length);
  const rngDexId = activeGroup[rngIndex];
  const rngPokemon = Bot.pokemon.get(rngDexId);

  let rngGender = null;
  if (rngPokemon.genderRatio.male || rngPokemon.genderRatio.female) {
    rngGender = weightedRandom({ male: (rngPokemon.genderRatio.male / 100), female: (rngPokemon.genderRatio.female / 100) });
  }

  let embedIcon = `${pokeConstants.ICON_URL}${rngPokemon.sprites.icon}`;
  let embedImage = rngPokemon.sprites.animated.default;

  if (rngGender && rngPokemon.sprites.animated.hasOwnProperty(rngGender)) {
    embedImage = rngPokemon.sprites.animated[rngGender];
  }

  const pokemonDetails = `Rarity: ${pokeConstants.RARITY[rngRarity]} | Gender: ${rngGender || 'N/A'}`;
  const pokeballStatus = `Poke Balls: ${trainer.pokeballs.pokeball} | Great Balls: ${trainer.pokeballs.greatball} | Ultra Balls: ${trainer.pokeballs.ultraball}`;
  const embedFooter = `${pokemonDetails}\n\n${pokeballStatus}`;

  let botEmbed = new Discord.MessageEmbed()
    .setAuthor(`${message.member.displayName} found a wild ${rngPokemon.name}!`, message.author.displayAvatarURL())
    .setDescription('Catch it or run away by reacting an emoji below')
    .setImage(embedImage)
    .setThumbnail(embedIcon)
    .setColor(botConfig.COLOR)
    .setFooter(embedFooter);

  return message.channel.send(botEmbed)
    .then(sent => {

      reactX(sent, trainer);

      const xTimer = setTimeout(() => {

        sent.reactions.removeAll();

        let ranEmbed = new Discord.MessageEmbed()
          .setAuthor(`${message.member.displayName}, the wild ${rngPokemon.name} has fled!`, message.author.displayAvatarURL())
          .setDescription('Tip: You have 25 seconds to react before a pokemon runs away.')
          .setThumbnail(embedIcon)
          .setColor(botConfig.COLOR)
          .setFooter(`Pokemon seen on ${sent.createdAt}`);

        sent.edit(ranEmbed);

        Bot.exploring.delete(message.author.id);

      }, pokeConstants.COOLDOWNS.EXPLORE);

      Bot.exploring.set(message.author.id, {
        attempts: 0,
        dexId: rngDexId,
        gender: rngGender,
        botEmbed: botEmbed,
        pokemon: rngPokemon,
        timer: xTimer,
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
  name: 'x',
  description: 'Explore the wild to find pokemon',
  category: 'pokemon',
  usage: '!x'
};
