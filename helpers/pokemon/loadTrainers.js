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
        bagLimit: row.bag_limit,
        dexLimit: row.dex_limit,
        dexGen1: JSON.parse(row.dex_gen1),
        dexGen2: JSON.parse(row.dex_gen2),
        dexGen3: JSON.parse(row.dex_gen3),
        dexGen4: JSON.parse(row.dex_gen4),
        dexGen5: JSON.parse(row.dex_gen5),
        dexGen6: JSON.parse(row.dex_gen6),
        dexGen7: JSON.parse(row.dex_gen7),
        dexGen8: JSON.parse(row.dex_gen8),
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