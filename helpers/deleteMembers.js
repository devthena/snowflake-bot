const startBackup = require('./startBackup');

/**
 * Deletes records for members who have left the server
 * @param {ClientUser} Bot 
 * @param {Database} db 
 * @param {Array} toDelete 
 */
const deleteMembers = (Bot, db, toDelete) => {

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