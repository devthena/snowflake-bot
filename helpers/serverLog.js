const { MessageEmbed } = require('discord.js');
const { LOG_CHANNEL } = require('../constants/botConfig');
const statusColors = require('../constants/statusColors');
const logServerId = process.env.LOG_SERVER_ID;

/**
 * Log events in a Discord server
 * @param {Client} Bot
 * @param {String} logEvent 
 */
const log = (Bot, logEvent) => {

  const logServer = Bot.guilds.cache.get(logServerId);

  if (logServer) {

    const logChannel = logServer.channels.cache.find(channel => {
      return channel.name.includes(LOG_CHANNEL) && channel.isText();
    });

    if (logServer.available && logChannel) {

      let botEmbed = new MessageEmbed()
        .setAuthor(`${logEvent.author} Server`, `${logEvent.authorIcon || ''}`)
        .setDescription(logEvent.message)
        .setColor(statusColors[logEvent.type]);
      
      if(logEvent.thumbnail) botEmbed.setThumbnail(logEvent.thumbnail);
      if(logEvent.footer) botEmbed.setFooter(logEvent.footer);

      return logChannel.send({ embeds: [botEmbed] });
    }
  }
};

module.exports = log;