const serverLog = require('../helpers/serverLog');

/**
 * Removes nickname of member when their subscriber or nitro booster status is removed
 * @listens event:guildMemberUpdate
 * @param {Client} Bot
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember
 */
module.exports = async (Bot, oldMember, newMember) => {

  if (!newMember.nickname || !oldMember.nickname || newMember.premiumSince) return;

  const subRole = newMember.guild.roles.cache.find(role => role.name.includes('Subscriber'));

  const isSubscriber = subRole ? newMember.roles.cache.has(subRole.id) : false;
  if (isSubscriber) return;

  const isPastSubscriber = subRole ? oldMember.roles.cache.has(subRole.id) : false;
  
  if (newMember.managable && (oldMember.premiumSince || isPastSubscriber)) {
    
    newMember.setNickname(null);

    const logEvent = {
      author: newMember.guild.name,
      authorIcon: newMember.guild.iconURL(),
      message: `Nickname has been reset for ${ newMember.user.tag }`,
      footer: `Discord User ID: ${ newMember.id }`,
      type: 'reset'
    };

    serverLog(Bot, logEvent);
  }
};
