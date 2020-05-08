const schedule = require('node-schedule');
const sqlite3 = require('sqlite3').verbose();
const botActivities = require('./../constants/bot-activities');
const CONSTANTS = require('./../constants/general');

let backupTimer = null;
let pointer = 0;

module.exports = (Bot) => {

  Bot.loadCommand = (command) => {

    try {
      const comm = require(`./../commands/${command}`);
      Bot.logger.info(`[SYS] Loading command: ${comm.info.name}`);
      Bot.commands.set(comm.info.name, comm);
      comm.conf.aliases.forEach(alias => {
        Bot.aliases.set(alias, comm.info.name);
      });
      return false;
    } catch (e) {
      Bot.logger.error(`[SYS] Error loading command ${command}: ${e}`);
    }
  };

  Bot.loadServerData = () => {

    let db = new sqlite3.Database('./master.db', error => {
      if (error) return Bot.logger.error(`[DB] loadServerData: ${error}`);
    });

    let serverCount = 0;
    let lastIndex = Bot.guilds.size;

    Bot.guilds.forEach(guild => {

      let blankMap = new Map();
      let serverConfig = {
        members: blankMap
      };

      let sql = `SELECT * FROM guilds WHERE server_id = ${guild.id}`;

      db.get(sql, (error, row) => {
        if (error) return Bot.logger.error(`[DB] loadServerData: ${error}`);

        if (row) {

          serverConfig.mods = {
            alertOptin: row.mod_alert_optin,
            alertStream: row.mod_alert_stream,
            autoAdd: row.mod_auto_add,
            game8Ball: row.mod_game_8ball,
            gameGamble: row.mod_game_gamble,
            highlightBoard: row.mod_highlight_board,
            optins: row.mod_optins
          };
          serverConfig.roles = {
            autoAdd: row.role_auto_add,
            moderator: row.role_moderator,
            optins: row.role_optins
          };
          serverConfig.channels = {
            alertOptin: row.channel_alert_optin,
            alertStream: row.channel_alert_stream,
            highlightBoard: row.channel_highlight_board
          };
          serverConfig.messages = {
            alertStream: row.message_alert_stream
          };

          if (guild.ownerID !== row.owner_id) {
            db.run(`UPDATE guilds SET owner_id = ${guild.ownerID} WHERE server_id = ${guild.id}`, error => {
              if (error) Bot.logger.error(`[DB] loadServerData: ${error}`);
              serverCount++;
              if (serverCount === lastIndex) Bot.loadMemberData(db);
            });
          } else {
            serverCount++;
            if (serverCount === lastIndex) Bot.loadMemberData(db);
          }

        } else {

          serverConfig.mods = {
            alertOptin: 'false',
            alertStream: 'false',
            autoAdd: 'true',
            game8Ball: 'true',
            gameGamble: 'true',
            highlightBoard: 'false',
            optins: 'false'
          };
          serverConfig.roles = {
            autoAdd: '',
            moderator: '',
            optins: ''
          };
          serverConfig.channels = {
            alertOptin: '',
            alertStream: '',
            highlightBoard: ''
          };
          serverConfig.messages = {
            alertStream: ''
          };

          let columns = `(server_id,owner_id,${CONSTANTS.MODS.join()},${CONSTANTS.ROLES.join()},${CONSTANTS.CHANNELS.join()},${CONSTANTS.MESSAGES.join()})`;
          let values = `(${guild.id},${guild.ownerID},${CONSTANTS.DEFAULT_MOD_VALUES})`;

          db.run(`INSERT INTO guilds ${columns} VALUES ${values}`, error => {
            if (error) Bot.logger.error(`[DB] loadServerData: ${error}`);
            serverCount++;
            if (serverCount === lastIndex) Bot.loadMemberData(db);
          });

        }
      });

      Bot.servers.set(guild.id, serverConfig);
    });
  };

  // Temporarily disable this until we are able to make it per server
  Bot.loadSchedules = () => {

    Bot.servers.forEach(server => {

      Bot.logger.info(`[SYS] Loading schedule for server: ${server.guild.name}`);
      let optinAlertChannel = server.guild.channels.find(channel => channel.name === server.channels.optinAlertChannel);
      let optinRole = server.guild.roles.find(role => role.name === server.roles.optinRole);
      let optinAlertTag = optinRole ? server.messages.optinAlertTag.replace('{role}', optinRole) : server.messages.optinAlertTag.replace('{role}', '');

      // Schedule the alert to fire every Sunday at 6:15pm EST - Pre-Show
      // TODO: Update this so the values are per server
      server.optAlert = schedule.scheduleJob({
        hour: 22,
        minute: 15,
        dayOfWeek: 0
      }, // this uses UTC timezone
        function () {
          if (optinAlertChannel && server.settings.enableOptinAlerts == 'true') {
            Bot.logger.info(`[SYS] Optin alert fired for server: ${server.guild.name}`);
            optinAlertChannel.send(`${server.messages.optinAlertMessage}`);
            optinAlertChannel.send(`${optinAlertTag}`);
          }
        });
    });
  };

  Bot.loadMemberData = (db) => {

    let serverCount = 0;
    let lastIndex = Bot.servers.size;
    let toDelete = [];

    Bot.servers.forEach((server, id) => {

      let guild = Bot.guilds.get(id);
      let sql = `SELECT * from members WHERE server_id = ${id}`;

      guild.members.forEach(member => {
        server.members.set(member.id, { points: 0 });
      });

      db.each(sql, (error, row) => {
        if (error) Bot.logger.error(`[DB] loadMemberData: ${error}`);

        if (row) {
          let member = guild.members.get(row.user_id);
          if (!member) {
            toDelete.push(row.id);
          } else {
            server.members.set(row.user_id, {
              uniqueID: row.id,
              points: row.points
            });
          }
        }

        serverCount++;
        if (serverCount === lastIndex) {
          Bot.purgeMembers(db, toDelete);
        }
      });
    });
  };

  Bot.purgeMembers = (db, toDelete) => {

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
              if (error) Bot.logger.error(`[DB] purgeMembers: ${error}`);
              Bot.startBackupTimer();
            });
          }
        });
      });

    } else {
      db.close(error => {
        if (error) Bot.logger.error(`[DB] purgeMembers: ${error}`);
        Bot.startBackupTimer();
      });
    }
  };

  Bot.startBackup = () => {

    let db = new sqlite3.Database('./master.db', error => {
      if (error) return Bot.logger.error(`[DB] startBackup: ${error}`);
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
                if (error) return Bot.logger.error(`[DB] startBackup: ${error}`);
              });
            }
          }
        });
      });
    });
  };

  Bot.startBackupTimer = () => {

    if (pointer < botActivities.length) {
      Bot.user.setActivity(botActivities[pointer].activity, { type: botActivities[pointer].type });
      pointer++;
      if (pointer >= botActivities.length) pointer = 0;
    }

    Bot.startBackup();

    if (backupTimer) clearTimeout(backupTimer);
    backupTimer = setTimeout(() => {
      Bot.startBackupTimer();
    }, CONSTANTS.POINTS_BACKUP_RATE);
  };

};
