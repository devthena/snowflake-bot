const sqlite3 = require('sqlite3').verbose();

/**
 * Updates the database with server members data
 * @param {ClientUser} Bot 
 */
const backupMembers = Bot => {

  let db = new sqlite3.Database('./master.db', error => {
    if (error) return Bot.logger.error(`[DB] backupMembers: ${error}`);
  });

  let serverCount = 0;
  let lastIndex = Bot.servers.size;
  let sql = 'INSERT OR REPLACE INTO members (id,user_id,server_id,points) VALUES (?,?,?,?)';

  Bot.servers.forEach((server, serverID) => {
    Bot.logger.info(`[DB] startBackup: ${serverID}, size ${server.members.size}`);

    let processCount = 0;

    server.members.forEach((member, userID) => {

      const uniqueID = member.uniqueID ? member.uniqueID : `${userID}-${Date.now()}`;

      db.run(sql, [uniqueID, userID, serverID, member.points], error => {
        if (error) Bot.logger.error(`[DB] Cannot update points for ${userID}: ${error}`);

        processCount++;
        if (processCount === server.members.size) {

          Bot.logger.info(`[DB] Backup done for ${serverID}`);

          serverCount++;
          if (serverCount === lastIndex) {
            db.close(error => {
              if (error) return Bot.logger.error(`[DB] backupMembers: ${error}`);
            });
          }
        }
      });
    });
  });
};

module.exports = backupMembers;