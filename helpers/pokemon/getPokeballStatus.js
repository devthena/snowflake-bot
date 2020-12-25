/**
 * Creates a string with the total amount of pokeballs per type
 * @param {Object} trainer
 * @returns {String}
 */
const getPokeballStatus = trainer => {
  if (!trainer.pokeballs.total) return 'You have no more Poke Balls!';
  return `Poke Ball: ${trainer.pokeballs.pokeball}  |  Great Ball: ${trainer.pokeballs.greatball}  |  Ultra Ball: ${trainer.pokeballs.ultraball}`;
};

module.exports = getPokeballStatus;