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
  });

  Bot.pokemonByRarity.set('C', common);
  Bot.pokemonByRarity.set('U', uncommon);
  Bot.pokemonByRarity.set('R', rare);
  Bot.pokemonByRarity.set('V', veryRare);
  Bot.pokemonByRarity.set('L', legendary);
  Bot.pokemonByRarity.set('M', mythical);

  Bot.logger.info(`[DB] groupPokemon: C - ${common.length} | U - ${uncommon.length} | R - ${rare.length} | V - ${veryRare.length} | L - ${legendary.length} | M - ${mythical.length}`);
};

module.exports = groupPokemon;