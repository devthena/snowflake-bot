const PDB_NAME = process.env.PDB_NAME;
const sqlite3 = require('sqlite3').verbose();

/**
 * Add trainers to the Bot object
 * @param {ClientUser} Bot
 */
const loadTrainers = Bot => {

  const db = new sqlite3.Database(`./${PDB_NAME}`, error => {
    if (error) return Bot.logger.error(`[DB] loadTrainers: ${error}`);
  });

  let sql = `SELECT * FROM trainers`;

  db.each(sql, (error, row) => {
    if (error) Bot.logger.error(`[DB] loadTrainers: ${error}`);

    if (row) {

      Bot.trainers.set(row.trainer_id, {
        pokeballs: JSON.parse(row.pokeballs),
        pokedex: {
          gen1: JSON.parse(row.dex_gen1),
          gen2: JSON.parse(row.dex_gen2),
          gen3: JSON.parse(row.dex_gen3),
          gen4: JSON.parse(row.dex_gen4),
          gen5: JSON.parse(row.dex_gen5),
          gen6: JSON.parse(row.dex_gen6),
          gen7: JSON.parse(row.dex_gen7),
          gen8: JSON.parse(row.dex_gen8)
        },
        bagLimit: row.bag_limit,
        dexLimit: row.dex_limit,
        dexTotal: row.dex_total,
        obtainedTotal: row.obtained_total
      });

    }

  });

  db.close(error => {
    if (error) Bot.logger.error(`[DB] loadTrainers: ${error}`);
    Bot.logger.info(`[DB] loadTrainers: ${Bot.trainers.size} trainers loaded.`);
  });
};

module.exports = loadTrainers;