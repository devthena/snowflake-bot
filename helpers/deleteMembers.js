const DB_NAME = process.env.DB_NAME;
const sqlite3 = require('sqlite3').verbose();
const startBackup = require('./startBackup');

/**
 * Deletes records for members who have left the server
 * @param {ClientUser} Bot
 * @param {Array} toDelete 
 */
const deleteMembers = (Bot, toDelete) => {

  const db = new sqlite3.Database(`./${DB_NAME}`, error => {
    if (error) return Bot.logger.error(`[DB] deleteMembers: ${error}`);
  });

  let processCount = 0;
  let sql = 'DELETE from members WHERE id = ?';

  if (toDelete.length > 0) {

    toDelete.forEach(id => {
      db.run(sql, id, error => {
        if (error) Bot.logger.error(`[DB] Cannot delete score record for ${id}: ${error}`);
        else Bot.logger.info(`[DB] Deleted score record for ${id}`);

        processCount++;
        if (processCount === toDelete.length) {
          db.close(error => {
            if (error) Bot.logger.error(`[DB] deleteMembers: ${error}`);
            startBackup(Bot);
          });
        }
      });
    });

  } else {
    db.close(error => {
      if (error) Bot.logger.error(`[DB] deleteMembers: ${error}`);
      startBackup(Bot);
    });
  }
};

module.exports = deleteMembers;