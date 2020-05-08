const Discord = require('discord.js');

module.exports = (Bot, reaction, user) => {

  if (reaction.message.author.bot || user.bot) return;

  const server = Bot.servers.get(reaction.message.guild.id);
  if (!server) return;

  if (Bot.isTrue(server.mods.highlightBoard)) {
    if (!server.messageTrackIds) return;
    if (server.messageTrackIds && server.messageTrackIds.indexOf(reaction.message.id) < 0) return;

    if (reaction.count >= 5) {

      const highlightBoardChannel = reaction.message.guild.channels.find(channel => channel.name.includes(server.channels.highlightBoard));

      if (highlightBoardChannel) {

        let attachment = null;
        if (reaction.message.attachments.first()) {
          attachment = reaction.message.attachments.first().url;
        }

        const botEmbed = new Discord.RichEmbed()
          .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL)
          .setColor('#FFBFFA')
          .setDescription(`${reaction.message.cleanContent}\n\nLink for [original message](${reaction.message.url}) in ${reaction.message.channel}`)
          .setImage(attachment)
          .setFooter(`Posted on ${reaction.message.createdAt}`);
        highlightBoardChannel.send(botEmbed);
      }

      let index = server.messageTrackIds.indexOf(reaction.message.id);
      server.messageTrackIds.splice(index, 1);
      let timer = server.messageTimers.get(reaction.message.id);
      if (timer) clearTimeout(timer);
    }
  }

};
