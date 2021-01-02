/**
 * Adds the pokemon to a trainer's dex
 * @param {Client} Bot
 * @param {Object} data
 * @param {Object} trainer
 * @returns {String}
 */
const addPokemon = (Bot, data, trainer) => {

  const gen = `gen${data.pokemon.generation}`;

  if (trainer.pokedex[gen].hasOwnProperty(data.dexId)) {

    trainer.pokedex[gen][data.dexId].total += 1;

  } else {

    trainer.pokedex[gen][data.dexId] = {
      name: data.pokemon.name,
      default: 0,
      female: 0,
      male: 0,
      total: 1
    };
    trainer.obtainedTotal += 1;
  }

  trainer.dexTotal += 1;

  if (data.variation) {
    if (!trainer.pokedex[gen][data.dexId][data.variation]) {
      trainer.pokedex[gen][data.dexId][data.variation] = 1;
    } else {
      trainer.pokedex[gen][data.dexId][data.variation] += 1;
    }
  } else if (data.gender) {
    trainer.pokedex[gen][data.dexId][data.gender] += 1;
  } else {
    trainer.pokedex[gen][data.dexId].default += 1;
  }

  Bot.trainers.set(data.trainerId, trainer);

  return `You now have a total of ${trainer.pokedex[gen][data.dexId].total} ${data.pokemon.name} in your dex.`;
};

module.exports = addPokemon;