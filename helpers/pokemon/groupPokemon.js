/**
 * Creat sub-groups of pokemon by rarity
 * @param {Client} Bot
 */
const groupPokemon = Bot => {

  let common = [];
  let uncommon = [];
  let rare = [];
  let veryRare = [];
  let legendary = [];
  let mythical = [];
  let nocturnal = [];

  Bot.pokemon.forEach((obj, id) => {
    switch (obj.rarity) {
      case 'U':
        uncommon.push(id);
        break;
      case 'R':
        rare.push(id);
        break;
      case 'V':
        veryRare.push(id);
        break;
      case 'L':
        legendary.push(id);
        break;
      case 'M':
        mythical.push(id);
        break;
      default:
        common.push(id);
    }
    if (/dark/.test(obj.types) || /ghost/.test(obj.types)) nocturnal.push(id);
  });

  Bot.pokemonGroups.set('C', common);
  Bot.pokemonGroups.set('U', uncommon);
  Bot.pokemonGroups.set('R', rare);
  Bot.pokemonGroups.set('V', veryRare);
  Bot.pokemonGroups.set('L', legendary);
  Bot.pokemonGroups.set('M', mythical);
  Bot.pokemonGroups.set('N', nocturnal);

};

module.exports = groupPokemon;