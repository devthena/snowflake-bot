const pokeConstants = require('../../constants/pokemon');
const randomIndex = require('../randomIndex');

/**
 * Determines if a pokemon will be caught or not
 * @param {String} ballType
 * @param {Object} data
 */
const catchPokemon = (ballType, data) => {

  if (ballType === pokeConstants.REACTS.MASTERBALL) return true;

  const partial = (3 * data.pokemon.hpMax - 2) * data.pokemon.catchRate * pokeConstants.BALL_BONUS[ballType];
  const modifiedCatchRate = partial / (3 * data.pokemon.hpMax);

  let n = null;
  switch (ballType) {
    case pokeConstants.REACTS.ULTRABALL:
      n = randomIndex(1, 150);
      break;
    case pokeConstants.REACTS.GREATBALL:
      n = randomIndex(1, 200);
      break;
    default:
      n = randomIndex(1, 255);
  }

  return n < modifiedCatchRate;
};

module.exports = catchPokemon;