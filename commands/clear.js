
exports.run = async (Bot, message, args) => {

  if (isNaN(args[0])) return message.channel.send('Please add the number of messages you want to delete.');

  let count = parseInt(args[0], 10);
  if (!count || count < 1) return message.channel.send('It has to be at least 1 message, goob :)');
  else if (count > 200) return message.channel.send('Ahhh that\'s too much! You can only delete a max of 200 at a time.');

  // delete the last message (user command) then fetch messages to bulk delete
  message.delete().then(async () => {

    let fetched = await message.channel.messages.fetch({ limit: count });
    Bot.logger.warn(`[COMM] CLEAR: ${fetched.size} messages found, deleting...`);

    let twoWeekTimestamp = Date.now() - 12096e5;
    let filteredFetched = fetched.filter(msg => (msg.createdTimestamp - twoWeekTimestamp) > 0);

    message.channel.bulkDelete(filteredFetched, true) // filterOld = true
      .catch(function (error) {
        Bot.logger.error(`[COMM] CLEAR: ${error}`);
        message.reply(error);
      });
  });
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 9
};

exports.info = {
  name: 'clear',
  description: 'Deletes messages from a channel.',
  category: 'default',
  usage: '!clear <count>'
};
