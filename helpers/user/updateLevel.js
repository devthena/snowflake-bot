const Discord = require('discord.js');
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

    if (botChannel) {
      let botEmbed = new Discord.MessageEmbed()
        .setTitle('Level Up!')
        .setDescription(`:gem: ${displayName} has advanced to level ${updatedMember.level}! :gem:`)
        .setColor(botConfig.COLOR);

      return botChannel.send(botEmbed);
    }
  }

  return updatedMember;
};

module.exports = updateLevel;