const serverLog = require('../helpers/serverLog');

/**
 * Remove member from the database when banned
 * @listens event:guildBanAdd
 * @param {Client} Bot 
 * @param {User} user
 */
module.exports = (Bot, guild, user) => {

  if (!guild?.available) return;

  let logEvent = {
    author: guild.name,
    authorIcon: guild.iconURL(),
    message: `${user.tag} has been banned from the server.`,
    footer: `Discord User ID: ${user.id}`,
    type: 'ban'
  };

  serverLog(Bot, logEvent);
  Bot.db.collection('members').deleteOne({ userId: user.id });
};