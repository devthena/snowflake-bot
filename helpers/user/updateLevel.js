const botConfig = require('../../constants/botConfig');

/**
 * Adjusts the level and exp values of a member
 * @param {Object} member 
 * @param {String} displayName 
 * @param {Collection} guildChannels 
 */
const updateLevel = (member, displayName, guildChannels) => {

  let updatedMember = JSON.parse(JSON.stringify(member));
  const totalExp = member.level * botConfig.LVL_MULTIPLIER;

  if (member.exp >= totalExp) {
    updatedMember.level = member.level + 1;
    updatedMember.exp = member.exp - totalExp;
    const botChannel = guildChannels.cache.find(channel => {
      return channel.name.includes(botConfig.CHANNEL) && channel.isText();
    });
    if (botChannel) botChannel.send(`${displayName} has advanced to level ${updatedMember.level}! :gem:`);
  }

  return updatedMember;
};

module.exports = updateLevel;