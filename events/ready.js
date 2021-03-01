const DB_NAME = process.env.DB_NAME;
const dbConfig = require('../constants/dbConfig');
const serverConfig = require('../constants/serverConfig');
const sqlite3 = require('sqlite3').verbose();
const VALID_EMOJIS = require('../constants/pokemon').VALID_EMOJIS;
const loadMembers = require('../helpers/loadMembers');

/**
 * Creates Map variables for tracking server data
 * @listens event:ready
 * @param {Client} Bot 
 */
module.exports = async Bot => {

  Bot.logger.info('* Snowflake is online *');

  Bot.emojis.cache.forEach(emoji => {
    if (VALID_EMOJIS.includes(emoji.name)) Bot.pokemonEmojis.set(emoji.name, emoji);
  });

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

        config.channels = {
          alertStream: row.channel_alert_stream,
          highlightBoard: row.channel_highlight_board,
          highlightIgnore: row.channel_highlight_ignore
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
        config.settings = {
          gamblePercent: parseInt(row.settings_gamble_percent, 10)
        }

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

        let columns = `(server_id,owner_id,${dbConfig.MODS.join()},${dbConfig.ROLES.join()},${dbConfig.CHANNELS.join()})`;
        let values = `(${guild.id},${guild.ownerID},${dbConfig.DEFAULT_VALUES})`;

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

    Bot.servers.set(guild.id, config);
  });
};
