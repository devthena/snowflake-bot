/**
 * Adds the pokemon to a trainer's dex
 * @param {Client} Bot
 * @param {Object} data
 * @param {Object} trainer
 * @returns {String}
 */
const addPokemon = (Bot, data, trainer) => {

  const gen = `dexGen${data.pokemon.generation}`;

  if (trainer[gen].hasOwnProperty(data.dexId)) {

    trainer[gen][data.dexId].total += 1;

  } else {

    trainer[gen][data.dexId] = {
      genderless: 0,
      female: 0,
      male: 0,
      total: 1
    };
    trainer.obtainedTotal += 1;
  }

  trainer.dexTotal += 1;

  if (data.gender) {
    trainer[gen][data.dexId][data.gender] += 1;
  } else {
    trainer[gen][data.dexId].genderless += 1;
  }

  Bot.trainers.set(data.trainerId, trainer);

  return `You now have a total of ${trainer[gen][data.dexId].total} ${data.pokemon.name} in your dex.`;
};

module.exports = addPokemon;