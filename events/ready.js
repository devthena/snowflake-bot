const DB_NAME = process.env.DB_NAME;
const LOCAL = process.env.LOCAL;

const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const memberConfig = require('../constants/memberConfig');
const serverConfig = require('../constants/serverConfig');
const globalCommands = require('../constants/globalCommands');
const serverCommands = require('../constants/serverCommands');

const asyncForEach = require('../helpers/asyncForEach');
const isTrue = require('../helpers/isTrue');
const startBackup = require('../helpers/startBackup');

/**
 * Creates Map variables for tracking server data
 * @listens event:ready
 * @param {Client} Bot 
 */
module.exports = async Bot => {

  console.log('* Snowflake is online *');

  const db = await open({
    filename: `./${DB_NAME}`,
    driver: sqlite3.Database
  });

  if(!Bot.application?.commands) await Bot.application?.fetch();

  if(!isTrue(LOCAL)) await Bot.application?.commands.set(globalCommands);

  const guildArray = Array.from(Bot.guilds.cache.values());

  await asyncForEach(guildArray, async guild => {

    if(isTrue(LOCAL)) {

      const commands = await Bot.guilds.cache.get(guild.id)?.commands.set(serverCommands);
      const commArray = Array.from(commands.values());

      await asyncForEach(commArray, async comm => {
        if(['clear', 'nickname', 'take'].includes(comm.name)) {
          comm.permissions.set({
            permissions: [{ id: guild.ownerId, type: 'USER', permission: true }]
          });
        }
      });

    }

    let memberMap = new Map();
    let config = JSON.parse(JSON.stringify(serverConfig));

    guild.members.cache.forEach(member => {
      memberMap.set(member.id, JSON.parse(JSON.stringify(memberConfig)));
    });

    config.members = memberMap;

    let row = null;

    try {
      row = await db.get(`SELECT * FROM guilds WHERE server_id = ${guild.id}`);
    } catch(err) { console.error(err); }

    if(row) {

      config.channels = JSON.parse(row.channels);
      config.mods = JSON.parse(row.mods);
      config.roles = JSON.parse(row.roles);
      config.settings = JSON.parse(row.settings);

      if (guild.ownerId !== row.owner_id) {
        try {
          await db.run(`UPDATE guilds SET owner_id = ${guild.ownerId} WHERE server_id = ${guild.id}`);
        } catch(err) { console.error(err); }
        
      }

    } else {

      const columns = `(server_id,owner_id,channels,mods,roles,settings)`;
      const values = `(${guild.id},${guild.ownerId},${JSON.stringify(config.channels)},${JSON.stringify(config.mods)},${JSON.stringify(config.roles)},${JSON.stringify(config.settings)})`;

      try {
        await db.run(`INSERT INTO guilds ${columns} VALUES ${values}`);
      } catch(err) { console.error(err); }

    }

    let toDelete = [];

    try {

      await db.each(`SELECT * from members WHERE server_id = ${guild.id}`, (error, entry) => {
        
        if (error) Bot.logger.error(`[DB] loadMembers: ${error}`);

        if (entry) {
          let member = guild.members.cache.get(entry.user_id);
          if (!member) {
            toDelete.push(entry.id);
          } else {
            config.members.set(entry.user_id, {
              uniqueId: entry.id,
              level: entry.level ? entry.level : 1,
              exp: entry.exp ? entry.exp : 0,
              points: entry.points,
              stars: entry.stars ? entry.stars : 0
            });
          }
        }
      });

    } catch(err) { console.error(err); }

    Bot.servers.set(guild.id, config);


    await asyncForEach(toDelete, async item => {

      try {
        await db.run(`DELETE from members WHERE id = ${item}`);
      } catch(err) { console.error(err); }

      Bot.logger.info(`[DB] Deleted score record for ${item}`);
    });

  });

  try {
    await db.close();
  } catch(err) { console.error(err); }
  
  if(!isTrue(LOCAL)) startBackup(Bot);
};
