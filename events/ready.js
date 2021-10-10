const LOCAL = process.env.LOCAL;

const serverConfig = require('../constants/serverConfig');
const globalCommands = require('../constants/globalCommands');
const serverCommands = require('../constants/serverCommands');

const asyncForEach = require('../helpers/asyncForEach');
const isTrue = require('../helpers/isTrue');
const startTimer = require('../helpers/startTimer');

/**
 * Creates Map variables for tracking server data
 * @listens event:ready
 * @param {Client} Bot 
 */
module.exports = async Bot => {

  console.log('* Snowflake is online *');

  if(!Bot.application?.commands) await Bot.application?.fetch();
  if(!isTrue(LOCAL)) await Bot.application?.commands.set(globalCommands);

  const guildArray = Array.from(Bot.guilds.cache.values());

  await asyncForEach(guildArray, async guild => {

    if(!isTrue(LOCAL)) {

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

    let config = JSON.parse(JSON.stringify(serverConfig));
    let row = null;

    try {
      row = await Bot.db.collection('guilds').findOne({ serverId: guild.id });
    } catch(err) { console.error(err); }

    if(row) {

      config.channels = JSON.parse(row.channels);
      config.mods = JSON.parse(row.mods);
      config.roles = JSON.parse(row.roles);
      config.settings = JSON.parse(row.settings);

      if (guild.ownerId !== row.ownerId) {
        try {
          await Bot.db.collection('guilds').updateOne({ serverId: guild.id }, { $set: { ownerId: guild.ownerId } });
        } catch(err) { console.error(err); }
      }

    } else {

      try {
        await Bot.db.collection('guilds').insertOne({
          serverId: guild.id,
          ownerId: guild.ownerId,
          channels: JSON.stringify(config.channels),
          mods: JSON.stringify(config.mods),
          roles: JSON.stringify(config.roles),
          settings: JSON.stringify(config.settings)
        });
      } catch(err) { console.error(err); }

    }

    Bot.servers.set(guild.id, config);

    try {

      const members = await Bot.db.collection('members').find({ serverId: guild.id }).toArray();
      const filtered = members.filter(member => !guild.members.cache.get(member.userId));

      await asyncForEach(filtered, async member => {
        await Bot.db.collection('members').deleteOne({ userId: member.userId });
        Bot.logger.info(`[DB] Deleted record for: ${ member.userId }`);
      });

    } catch(err) { console.error(err); }

  });
  
  if(!isTrue(LOCAL)) startTimer(Bot);
};
