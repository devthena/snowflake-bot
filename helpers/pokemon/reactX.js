const pokeConstants = require('../../constants/pokemon');

/**
 * Updates the reactions for the explore embed
 * @param {Client} Bot
 * @param {Message} message
 * @param {Object} trainer
 */
const reactX = (Bot, message, trainer) => {

  if (trainer.pokeballs.pokeball) message.react(Bot.pokemonEmojis[pokeConstants.REACTS.POKEBALL]);
  if (trainer.pokeballs.greatball) message.react(Bot.pokemonEmojis[pokeConstants.REACTS.GREATBALL]);
  if (trainer.pokeballs.ultraball) message.react(Bot.pokemonEmojis[pokeConstants.REACTS.ULTRABALL]);
  if (trainer.pokeballs.masterball) message.react(Bot.pokemonEmojis[pokeConstants.REACTS.MASTERBALL]);

  message.react(pokeConstants.REACT_UNI.CANCEL);
};

module.exports = reactX;