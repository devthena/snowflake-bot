const DB_NAME = process.env.DB_NAME;
const botConfig = require('../constants/botConfig');
const serverConfig = require('../constants/serverConfig');
const sqlite3 = require('sqlite3').verbose();
const loadMembers = require('../helpers/loadMembers');

/**
 * Creates Map variables for tracking server data
 * @listens event:ready
 * @param {Client} Bot 
 */
module.exports = async Bot => {
  Bot.logger.info('* Snowflake is online *');

  const db = new sqlite3.Database(`./${DB_NAME}`, error => {
    if (error) return Bot.logger.error(`[DB] Event Ready: ${error}`);
  });

  let serverCount = 0;
  let lastIndex = Bot.guilds.cache.size;

  Bot.guilds.cache.forEach(guild => {

    let blankMap = new Map();
    let config = JSON.parse(JSON.stringify(serverConfig));

    config.cooldowns = [];
    config.members = blankMap;

    let sql = `SELECT * FROM guilds WHERE server_id = ${guild.id}`;

    db.get(sql, (error, row) => {

      if (error) return Bot.logger.error(`[DB] Event Ready: ${error}`);

      if (row) {

        config.channels = JSON.parse(row.channels);
        config.mods = JSON.parse(row.mods);
        config.roles = JSON.parse(row.roles);
        config.settings = JSON.parse(row.settings);

        Bot.servers.set(guild.id, config);

        if (guild.ownerID !== row.owner_id) {
          db.run(`UPDATE guilds SET owner_id = ${guild.ownerID} WHERE server_id = ${guild.id}`, error => {
            if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
            serverCount++;
            if (serverCount === lastIndex) {
              db.close(error => {
                if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
                loadMembers(Bot);
              });
            }
          });
        } else {
          serverCount++;
          if (serverCount === lastIndex) {
            db.close(error => {
              if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
              loadMembers(Bot);
            });
          }
        }

      } else {

        Bot.servers.set(guild.id, config);

        let columns = `(server_id,owner_id,channels,mods,roles,settings)`;
        let values = `(${guild.id},${guild.ownerID},${JSON.stringify(config.channels)},${JSON.stringify(config.mods)},${JSON.stringify(config.roles)},${JSON.stringify(config.settings)})`;

        db.run(`INSERT INTO guilds ${columns} VALUES ${values}`, error => {
          if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
          serverCount++;
          if (serverCount === lastIndex) {
            db.close(error => {
              if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
              loadMembers(Bot);
            });
          }
        });

      }

    });

  });
};
