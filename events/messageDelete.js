const serverLog = require('../helpers/serverLog');

/**
 * @listens event:messageDelete
 * @param {Client} Bot 
 * @param {Message} message 
 */
module.exports = (Bot, message) => {

  const text = message.cleanContent.length > 0 ? message.cleanContent : 'N/A';
  const attached = message.attachments.first();

  let logEvent = {
    author: message.guild.name,
    authorIcon: message.guild.iconURL(),
    message: `Message Deleted In: ${ message.channel }\nAuthor: ${ message.author.tag }\nContent: ${ text }`,
    footer: `Posted on ${ message.createdAt }`
  };

  if(attached) logEvent.message += `\nAttached: ${ attached.url }`;

  serverLog(Bot, logEvent);
};