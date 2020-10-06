const DB_NAME = process.env.DB_NAME;
const sqlite3 = require('sqlite3').verbose();
const deleteMembers = require('./deleteMembers');

/**
 * Creates Map variables for tracking server members data
 * @param {ClientUser} Bot
 */
const loadMembers = Bot => {

  const db = new sqlite3.Database(`./${DB_NAME}`, error => {
    if (error) return Bot.logger.error(`[DB] loadMembers: ${error}`);
  });

  let serverCount = 0;
  let lastIndex = Bot.servers.size;
  let toDelete = [];

  Bot.servers.forEach((server, id) => {

    let guild = Bot.guilds.cache.get(id);
    let sql = `SELECT * from members WHERE server_id = ${id}`;

    guild.members.cache.forEach(member => {
      server.members.set(member.id, {
        level: 1,
        exp: 0,
        points: 0,
        stars: 0
      });
    });

    db.each(sql, (error, row) => {
      if (error) Bot.logger.error(`[DB] loadMembers: ${error}`);

      if (row) {
        let member = guild.members.cache.get(row.user_id);
        if (!member) {
          toDelete.push(row.id);
        } else {
          server.members.set(row.user_id, {
            uniqueID: row.id,
            level: row.level ? row.level : 1,
            exp: row.exp ? row.exp : 0,
            points: row.points,
            stars: row.stars ? row.stars : 0
          });
        }
      }

      serverCount++;
      if (serverCount === lastIndex) {
        db.close(error => {
          if (error) Bot.logger.error(`[DB] loadMembers: ${error}`);
          deleteMembers(Bot, toDelete);
        });
      }
    });
  });
};

module.exports = loadMembers;