const REACTS = require('../../constants/pokemon').REACTS;
const REACTS_UNI = require('../../constants/pokemon').REACTS_UNI;

/**
 * Updates the reactions for the explore embed
 * @param {Client} Bot
 * @param {Message} message
 * @param {Object} trainer
 */
const reactEmbed = (type, message, data) => {

  switch (type) {
    case 'confirm':
      message.react(REACTS_UNI.CONFIRM);
      break;
    case 'expand':
      message.react(REACTS_UNI.EXPAND)
      break;
    case 'x':
      if (data.pokeballs.pokeball) message.react(data.emojis.get(REACTS.POKEBALL));
      if (data.pokeballs.greatball) message.react(data.emojis.get(REACTS.GREATBALL));
      if (data.pokeballs.ultraball) message.react(data.emojis.get(REACTS.ULTRABALL));
      if (data.pokeballs.masterball) message.react(data.emojis.get(REACTS.MASTERBALL));
  };

  message.react(REACTS_UNI.CANCEL);
};

module.exports = reactEmbed;