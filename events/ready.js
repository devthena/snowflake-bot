const dbConfig = require('../constants/dbConfig');
const serverConfig = require('../constants/serverConfig');
const sqlite3 = require('sqlite3').verbose();
const loadMembers = require('../helpers/loadMembers');

/**
 * Creates Map variables for tracking server data
 * @listens event:ready
 * @param {ClientUser} Bot 
 */
module.exports = async Bot => {
  Bot.logger.info('* Snowflake is online *');

  let db = new sqlite3.Database('./master.db', error => {
    if (error) return Bot.logger.error(`[DB] Event Ready: ${error}`);
  });

  let serverCount = 0;
  let lastIndex = Bot.guilds.cache.size;

  Bot.guilds.cache.forEach(guild => {

    let blankMap = new Map();
    let config = JSON.parse(JSON.stringify(serverConfig));
    config.members = blankMap;

    let sql = `SELECT * FROM guilds WHERE server_id = ${guild.id}`;

    db.get(sql, (error, row) => {

      if (error) return Bot.logger.error(`[DB] Event Ready: ${error}`);

      if (row) {

        config.channels = {
          alertStream: row.channel_alert_stream,
          highlightBoard: row.channel_highlight_board
        };
        config.messages = {
          alertStream: row.message_alert_stream
        };
        config.mods = {
          alertStream: row.mod_alert_stream,
          autoAdd: row.mod_auto_add,
          game8Ball: row.mod_game_8ball,
          gameGamble: row.mod_game_gamble,
          highlightBoard: row.mod_highlight_board,
          optins: row.mod_optins
        };
        config.roles = {
          autoAdd: row.role_auto_add,
          moderator: row.role_moderator,
          optins: row.role_optins
        };

        if (guild.ownerID !== row.owner_id) {
          db.run(`UPDATE guilds SET owner_id = ${guild.ownerID} WHERE server_id = ${guild.id}`, error => {
            if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
            serverCount++;
            if (serverCount === lastIndex) loadMembers(Bot, db);
          });
        } else {
          serverCount++;
          if (serverCount === lastIndex) loadMembers(Bot, db);
        }

      } else {

        let columns = `(server_id,owner_id,${dbConfig.MODS.join()},${dbConfig.ROLES.join()},${dbConfig.CHANNELS.join()},${dbConfig.MESSAGES.join()})`;
        let values = `(${guild.id},${guild.ownerID},${dbConfig.DEFAULT_VALUES})`;

        db.run(`INSERT INTO guilds ${columns} VALUES ${values}`, error => {
          if (error) Bot.logger.error(`[DB] Event Ready: ${error}`);
          serverCount++;
          if (serverCount === lastIndex) loadMembers(Bot, db);
        });

      }
    });

    Bot.servers.set(guild.id, config);
  });
};
