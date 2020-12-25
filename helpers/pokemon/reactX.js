const pokeConstants = require('../../constants/pokemon');

/**
 * Updates the reactions for the explore embed
 * @param {Message} message
 * @param {Object} trainer
 */
const reactX = (message, trainer) => {

  if (trainer.pokeballs.pokeball) {
    const pokeballEmoji = message.guild.emojis.cache.find(emoji => emoji.name === pokeConstants.REACTS.POKEBALL);
    if (pokeballEmoji) message.react(pokeballEmoji);
  }
  if (trainer.pokeballs.greatball) {
    const greatballEmoji = message.guild.emojis.cache.find(emoji => emoji.name === pokeConstants.REACTS.GREATBALL);
    if (greatballEmoji) message.react(greatballEmoji);
  }
  if (trainer.pokeballs.ultraball) {
    const ultraballEmoji = message.guild.emojis.cache.find(emoji => emoji.name === pokeConstants.REACTS.ULTRABALL);
    if (ultraballEmoji) message.react(ultraballEmoji);
  }
  if (trainer.pokeballs.masterball) {
    const masterballEmoji = message.guild.emojis.cache.find(emoji => emoji.name === pokeConstants.REACTS.MASTERBALL)
    if (masterballEmoji) message.react(masterballEmoji);
  }

  message.react(pokeConstants.REACT_UNI.CANCEL);
};

module.exports = reactX;