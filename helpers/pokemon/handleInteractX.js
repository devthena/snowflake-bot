const pokeConstants = require('../../constants/pokemon');
const trainerConfig = require('../../constants/trainerConfig');
const addPokemon = require('./addPokemon');
const catchPokemon = require('./catchPokemon');
const getPokeballStatus = require('../pokemon/getPokeballStatus');
const reactEmbed = require('./reactEmbed');

/**
 * Update the message embed based on the user's reacted emoji
 * @param {Client} Bot
 * @param {MessageReaction} reaction
 * @param {User} user
 * @param {Object} data
 */
const handleInteractX = (Bot, reaction, user, data) => {

  const message = reaction.message;
  const embed = data.botEmbed;
  const seen = new Date(message.createdTimestamp);
  const attemptFails = [`Oh no! the pokemon broke free!`, `Aww! It appeared to be caught!`];

  message.reactions.removeAll();

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.CANCEL) {

    clearTimeout(data.timer);
    Bot.exploring.delete(message.id);

    embed.setTitle(`You ran away from the wild ${data.pokemon.name}!`);
    embed.setDescription('Tip: Some pokemon are nocturnal and only show up at night.');
    embed.setImage(null);
    embed.setFooter(`National Dex # ${data.dexId} | Pokemon seen at ${seen.getHours()}:${seen.getMinutes()}:${seen.getSeconds()} UTC`);

    return message.edit(embed);
  }

  if (pokeConstants.VALID_EMOJIS.includes(reaction.emoji.name)) {

    let trainer = Bot.trainers.get(user.id);
    if (!trainer) trainer = JSON.parse(JSON.stringify(trainerConfig));

    data.attempts += 1;
    trainer.pokeballs[reaction.emoji.name] -= 1;
    trainer.pokeballs.total -= 1;
    Bot.trainers.set(user.id, trainer);

    const isCaught = catchPokemon(reaction.emoji.name, data);

    if (isCaught) {

      clearTimeout(data.timer);
      Bot.exploring.delete(message.id);
      const description = addPokemon(Bot, data, trainer);
      const now = new Date();

      embed.setTitle(`Congrats, you caught a ${data.pokemon.name}!`);
      embed.setDescription(description);
      embed.setFooter(`National Dex # ${data.dexId} | Pokemon caught at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} UTC`);

      return message.edit(embed);
    }

    if (data.attempts < 3) {

      Bot.exploring.set(message.id, data);

      const rarity = pokeConstants.RARITY[data.pokemon.rarity];
      const gender = data.gender ? pokeConstants.GENDER[data.gender] : 'N/A';
      const pokemonDetails = `Rarity: ${rarity} | Gender: ${gender}`;

      embed.setTitle(attemptFails[data.attempts - 1]);
      embed.setDescription('You can try again or run away by reacting below.');
      embed.setFooter(`${pokemonDetails}\n\n${getPokeballStatus(trainer)}`);

      const reactParams = { emojis: Bot.pokemonEmojis, pokeballs: trainer.pokeballs };
      return message.edit(embed).then(() => reactEmbed('x', message, reactParams));
    }

    clearTimeout(data.timer);
    Bot.exploring.delete(message.id);

    embed.setTitle(`The wild ${data.pokemon.name} ran away!`);
    embed.setDescription('Tip: You have up to 3 attempts to catch a wild pokemon.');
    embed.setImage(null);
    embed.setFooter(`National Dex # ${data.dexId} | Pokemon seen at ${seen.getHours()}:${seen.getMinutes()}:${seen.getSeconds()} UTC`);

    return message.edit(embed);
  }

};

module.exports = handleInteractX;