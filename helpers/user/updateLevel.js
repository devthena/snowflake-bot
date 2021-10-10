const { MessageEmbed } = require('discord.js');
const { CHANNEL, COLOR, LVL_MULTIPLIER } = require('../../constants/botConfig');

/**
 * Adjusts the level and exp values of a member
 * @param {Object} member 
 * @param {String} nickname 
 * @param {Collection<GuildChannel>} guildChannels 
 */
const updateLevel = (member, addend, nickname, guildChannels) => {

  let updates = null;
  let currentExp = member.exp + addend;

  const levelValue = member.level <= 20 ? member.level : 20;
  const totalExp = levelValue * LVL_MULTIPLIER;

  if (currentExp >= totalExp) {

    updates = {
      level: member.level + 1,
      exp: currentExp - totalExp
    };

    const botChannel = guildChannels.cache.find(channel => {
      return channel.name.includes(CHANNEL) && channel.type === 'GUILD_TEXT';
    });

    if (botChannel) {
      let botEmbed = new MessageEmbed()
        .setTitle('User Level Up!')
        .setDescription(`${ nickname } advanced to level ${ updates.level }! :gem:`)
        .setColor(COLOR);

      botChannel.send({ embeds: [botEmbed] });
    }
    
  }

  return updates;
};

module.exports = updateLevel;