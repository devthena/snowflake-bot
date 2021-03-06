const Discord = require('discord.js');
const botConfig = require('../../constants/botConfig');

/**
 * Adjusts the level and exp values of a member
 * @param {Object} member 
 * @param {String} nickname 
 * @param {Collection<GuildChannel>} guildChannels 
 */
const updateLevel = (member, nickname, guildChannels) => {

  let updatedMember = JSON.parse(JSON.stringify(member));
  const levelValue = member.level <= 20 ? member.level : 20;
  const totalExp = levelValue * botConfig.LVL_MULTIPLIER;

  if (member.exp >= totalExp) {
    updatedMember.level = member.level + 1;
    updatedMember.exp = member.exp - totalExp;
    const botChannel = guildChannels.cache.find(channel => {
      return channel.name.includes(botConfig.CHANNEL) && channel.isText();
    });

    if (botChannel) {
      let botEmbed = new Discord.MessageEmbed()
        .setTitle('User Level Up!')
        .setDescription(`${ nickname } advanced to level ${ updatedMember.level }! :gem:`)
        .setColor(botConfig.COLOR);

      botChannel.send(botEmbed);
    }
  }

  return updatedMember;
};

module.exports = updateLevel;