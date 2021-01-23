const aikoId = process.env.AIKO_SERVER_ID;
const athenaId = process.env.ATHENA_SERVER_ID;
const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const pokeConstants = require('../constants/pokemon');
const trainerConfig = require('../constants/trainerConfig');
const getFormattedTime = require('../helpers/pokemon/getFormattedTime');
const getPokeballStatus = require('../helpers/pokemon/getPokeballStatus');
const randomIndex = require('../helpers/randomIndex');
const reactEmbed = require('../helpers/pokemon/reactEmbed');
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
    invalidMax: `${message.member.displayName}, you have no more space in your dex to add new pokemon. Either expand your \`!dex\` limit or \`!release\` one of your pokemon.`,
    noMultipleExplore: `${message.member.displayName}, there's still a wild pokemon in front of you!`,
    noPokeballs: `${message.member.displayName}, you are out of pokeballs! Check the \`!shop\` to buy more.`
  };

  let isExploring = false;
  Bot.exploring.forEach(obj => { if (obj.trainerId === message.author.id) isExploring = true; });
  if (isExploring) return message.delete().then(() => message.channel.send(notices.noMultipleExplore));

  let trainer = Bot.trainers.get(message.author.id);
  if (!trainer) {
    trainer = JSON.parse(JSON.stringify(trainerConfig));
    Bot.trainers.set(message.author.id, trainer);
  }

  if (trainer.dexTotal === trainer.dexLimit) return message.channel.send(notices.invalidMax);
  if (!trainer.pokeballs.total) return message.channel.send(notices.noPokeballs);

  const member = server.members.get(message.author.id);
  const rngRarity = (member.level > 1 && trainer.obtainedTotal > 10) ? weightedRandom(pokeConstants.WEIGHTED_RARITY) : 'C';

  const nocturnalGroup = Bot.pokemonGroups.get('N');
  const rarityGroup = Bot.pokemonGroups.get(rngRarity);

  let filteredRarityGroup = rarityGroup;
  switch (message.guild.id) {
    case aikoId:
      filteredRarityGroup = rarityGroup.filter(id => !pokeConstants.EXCLUSIVES[athenaId].includes(id));
      break;
    case athenaId:
      filteredRarityGroup = rarityGroup.filter(id => !pokeConstants.EXCLUSIVES[aikoId].includes(id));
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

  let rngVariation = null;
  let inPokedex = trainer.pokedex[`gen${rngPokemon.generation}`][rngDexId];
  if (rngPokemon.variations && inPokedex && inPokedex.total > 0) {
    let varPool = ['default'].concat(rngPokemon.variations.split(','));
    let varIndex = randomIndex(0, varPool.length);
    if (varIndex > 0) rngVariation = varPool[varIndex];
  }

  let embedIcon = `${pokeConstants.ICON_URL}${rngPokemon.sprites.icon}`;
  let embedImage = rngPokemon.sprites.animated.default;

  if (rngGender && rngPokemon.sprites.animated.hasOwnProperty(rngGender)) {
    embedImage = rngPokemon.sprites.animated[rngGender];
  }

  if (rngVariation && rngPokemon.sprites.animated.hasOwnProperty(rngVariation)) {
    embedImage = rngPokemon.sprites.animated[rngVariation];
  }

  let embedTitle = `You found a wild ${rngPokemon.name}!`;
  let dexPokemon = trainer.pokedex[`gen${rngPokemon.generation}`][rngDexId];
  if (dexPokemon && dexPokemon.total > 0) {
    embedTitle += ` ${Bot.pokemonEmojis.get(pokeConstants.REACTS.POKEBALL)}`;
  }

  let pokemonDetails = `Rarity: ${pokeConstants.RARITY[rngRarity]} | Gender: ${rngGender ? pokeConstants.GENDER[rngGender] : 'N/A'}`;
  if (rngVariation) pokemonDetails += ` | Variation: ${pokeConstants.VARIATIONS[rngVariation]}`;

  let botEmbed = new Discord.MessageEmbed()
    .setAuthor(`${message.member.displayName} Exploring`, message.author.displayAvatarURL())
    .setTitle(embedTitle)
    .setDescription('Catch it or run away by reacting below.')
    .setImage(embedImage)
    .setThumbnail(embedIcon)
    .setColor(botConfig.COLOR)
    .setFooter(`${pokemonDetails}\n\n${getPokeballStatus(trainer)}`);

  return message.channel.send(botEmbed).then(sent => {

    const reactParams = { emojis: Bot.pokemonEmojis, pokeballs: trainer.pokeballs };
    reactEmbed('x', sent, reactParams);

    const xTimer = setTimeout(() => {

      sent.reactions.removeAll();
      Bot.exploring.delete(sent.id);

      const seen = new Date(sent.createdTimestamp);

      botEmbed.setTitle(`The wild ${rngPokemon.name} has fled!`)
      botEmbed.setDescription('Tip: You have 30s to react before a pokemon runs away.')
      botEmbed.setImage(null);
      botEmbed.setFooter(`National Dex # ${rngDexId} | Pokemon seen at ${getFormattedTime(seen)}`);

      sent.edit(botEmbed);

    }, pokeConstants.COOLDOWNS.EXPLORE);

    Bot.exploring.set(sent.id, {
      attempts: 0,
      botEmbed: botEmbed,
      dexId: rngDexId,
      gender: rngGender,
      pokemon: rngPokemon,
      timer: xTimer,
      trainerId: message.author.id,
      variation: rngVariation
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
