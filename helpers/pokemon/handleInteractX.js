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
 * @param {Object} exploreData
 */
const handleInteractX = (Bot, reaction, user, exploreData) => {

  const message = reaction.message;
  const embed = exploreData.botEmbed;
  const attemptFails = [`Oh no! the pokemon broke free!`, `Aww! It appeared to be caught!`];

  message.reactions.removeAll();

  if (reaction.emoji.name === pokeConstants.REACTS_UNI.CANCEL) {

    clearTimeout(exploreData.timer);
    Bot.exploring.delete(message.id);

    embed.setTitle(`You ran away from the wild ${exploreData.pokemon.name}!`);
    embed.setDescription('Tip: Some pokemon are nocturnal and only show up at night.');
    embed.setImage(null);
    embed.setFooter(`Pokemon seen on ${message.createdAt}`);

    return message.edit(embed);
  }

  if (pokeConstants.VALID_EMOJIS.includes(reaction.emoji.name)) {

    let trainer = Bot.trainers.get(user.id);
    if (!trainer) trainer = JSON.parse(JSON.stringify(trainerConfig));

    exploreData.attempts += 1;
    trainer.pokeballs[reaction.emoji.name] -= 1;
    trainer.pokeballs.total -= 1;
    Bot.trainers.set(user.id, trainer);

    const isCaught = catchPokemon(reaction.emoji.name, exploreData);

    if (isCaught) {

      clearTimeout(exploreData.timer);
      Bot.exploring.delete(message.id);
      const description = addPokemon(Bot, exploreData, trainer);

      embed.setTitle(`Congrats, you caught a ${exploreData.pokemon.name}!`);
      embed.setDescription(description);
      embed.setFooter(`Pokemon caught on ${new Date().toDateString()}`);

      return message.edit(embed);
    }

    if (exploreData.attempts < 3) {

      Bot.exploring.set(message.id, exploreData);

      const rarity = pokeConstants.RARITY[exploreData.pokemon.rarity];
      const gender = exploreData.gender ? pokeConstants.GENDER[exploreData.gender] : 'N/A';
      const pokemonDetails = `Rarity: ${rarity} | Gender: ${gender}`;

      embed.setTitle(attemptFails[exploreData.attempts - 1]);
      embed.setDescription('You can try again or run away by reacting below.');
      embed.setFooter(`${pokemonDetails}\n\n${getPokeballStatus(trainer)}`);

      const reactParams = { emojis: Bot.pokemonEmojis, pokeballs: trainer.pokeballs };
      return message.edit(embed).then(() => reactEmbed('x', message, reactParams));
    }

    clearTimeout(exploreData.timer);
    Bot.exploring.delete(message.id);

    embed.setTitle(`The wild ${exploreData.pokemon.name} ran away!`);
    embed.setDescription('Tip: You have up to 3 attempts to catch a wild pokemon.');
    embed.setImage(null);
    embed.setFooter(`Pokemon seen on ${message.createdAt}`);

    return message.edit(embed);
  }

};

module.exports = handleInteractX;