const serverLog = require('../helpers/serverLog');

/**
 * @listens event:messageDelete
 * @param {Client} Bot 
 * @param {Message} message 
 */
module.exports = (Bot, message) => {

  if (/bot-/.test(message.channel.name)) return;

  const text = message.cleanContent.length > 0 ? message.cleanContent : null;

  let logEvent = {
    author: message.guild.name,
    authorIcon: message.guild.iconURL(),
    thumbnail: message.author.displayAvatarURL(),
    message: `Message Deleted In: ${ message.channel }\nAuthor: ${ message.author.tag }`,
    footer: `Discord User ID: ${ message.author.id }\nPosted on ${ message.createdAt }`,
    type: 'delete'
  };

  if(text) logEvent.message += `\n\nContent: ${ text }`;
  if(message.attachments.size > 0) {
    logEvent.message += `\n\nAttached Files:`;
    message.attachments.forEach(message => {
      logEvent.message += `\n${message.url}`;
    })
  }

  serverLog(Bot, logEvent);
};