const DB_NAME = process.env.DB_NAME;

const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const asyncForEach = require('./asyncForEach');

/**
 * Updates the database with server members data
 * @param {ClientUser} Bot 
 */
const backupMembers = async Bot => {

  const db = await open({
    filename: `./${DB_NAME}`,
    driver: sqlite3.Database
  });

  const serverArray = Array.from(Bot.servers.entries());
  const sql = 'INSERT OR REPLACE INTO members (id,user_id,server_id,level,exp,points,stars) VALUES (?,?,?,?,?,?,?)';

  await asyncForEach(serverArray, async server => {

    const serverId = server[0];
    const serverData = server[1];

    Bot.logger.info(`[DB] startBackup: ${serverId}, size ${serverData.members.size}`);

    const memberArray = Array.from(serverData.members.entries());
    await asyncForEach(memberArray, async member => {
      const uniqueId = member.uniqueId ? member.uniqueId : `${member[0]}-${Date.now()}`;
      await db.run(sql, [uniqueId, member[0], serverId, member[1].level, member[1].exp, member[1].points, member[1].stars]);
    });

    Bot.logger.info(`[DB] Backup done for ${serverId}`);
  });

  db.close();
};

module.exports = backupMembers;