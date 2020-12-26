const BALL_BONUS = require('../../constants/pokemon').BALL_BONUS;
const REACTS = require('../../constants/pokemon').REACTS;
const randomIndex = require('../randomIndex');

/**
 * Determines if a pokemon will be caught or not
 * @param {String} ballType
 * @param {Object} data
 */
const catchPokemon = (ballType, data) => {

  if (ballType === REACTS.MASTERBALL) return true;

  const partial = (3 * data.pokemon.hpMax - 2) * data.pokemon.catchRate * BALL_BONUS[ballType];
  const modifiedCatchRate = partial / (3 * data.pokemon.hpMax);

  let n = null;
  switch (ballType) {
    case REACTS.ULTRABALL:
      n = randomIndex(1, 150);
      break;
    case REACTS.GREATBALL:
      n = randomIndex(1, 200);
      break;
    default:
      n = randomIndex(1, 255);
  }

  return n < modifiedCatchRate;
};

module.exports = catchPokemon;