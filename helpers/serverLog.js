const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
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
      return channel.name.includes(botConfig.LOG_CHANNEL) && channel.isText();
    });

    if (logServer.available && logChannel) {

      let botEmbed = new Discord.MessageEmbed()
        .setAuthor(`${logEvent.author} Server`, `${logEvent.authorIcon || ''}`)
        .setDescription(logEvent.message)
        .setColor(botConfig.COLOR);
      
      if(logEvent.footer) botEmbed.setFooter(logEvent.footer);

      return logChannel.send(botEmbed);
    }
  }
};

module.exports = log;