const PDB_NAME = process.env.PDB_NAME;
const sqlite3 = require('sqlite3').verbose();
const groupPokemon = require('./groupPokemon');

/**
 * Add pokemon to the Bot object
 * @param {ClientUser} Bot
 */
const loadPokemon = Bot => {

  const db = new sqlite3.Database(`./${PDB_NAME}`, error => {
    if (error) return Bot.logger.error(`[DB] loadPokemon: ${error}`);
  });

  let sql = `SELECT * FROM pokedex`;

  db.each(sql, (error, row) => {
    if (error) Bot.logger.error(`[DB] loadPokemon: ${error}`);

    if (row) {

      Bot.pokemon.set(row.dex_id, {
        name: row.name,
        types: row.types.split(','),
        generation: row.generation,
        genderRatio: JSON.parse(row.gender_ratio),
        hpMax: row.hp_max,
        rarity: row.rarity,
        catchRate: row.catch_rate,
        sprites: JSON.parse(row.sprites)
      });

    }

  });

  db.close(error => {
    if (error) Bot.logger.error(`[DB] loadPokemon: ${error}`);
    Bot.logger.info(`[DB] loadPokemon: ${Bot.pokemon.size} pokemon loaded.`);
    groupPokemon(Bot);
  });
};

module.exports = loadPokemon;