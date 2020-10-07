const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');

/**
 * Tracks the number of reactions of messages for posting in highlight board
 * @listens event:messageReactionAdd
 * @param {ClientUser} Bot 
 * @param {MessageReaction} reaction 
 * @param {User} user 
 */
module.exports = (Bot, reaction, user) => {

  if (reaction.message.channel.type !== 'text') return;

  if (!reaction.message.guild.available) return;

  if (reaction.message.author.bot || user.bot || reaction.message.author.system) return;

  const server = Bot.servers.get(reaction.message.guild.id);
  if (!server) return;

  let member = server.members.get(user.id);
  if (!member) member = JSON.parse(JSON.stringify(memberConfig));

  member.exp += expAddends.reactionAdd;

  server.members.set(user.id, member);
  Bot.servers.set(reaction.message.guild.id, server);

  if (isTrue(server.mods.highlightBoard)) {
    if (!server.messageTrackIds) return;
    if (server.messageTrackIds && server.messageTrackIds.indexOf(reaction.message.id) < 0) return;

    if (reaction.count >= 5) {

      const highlightBoardChannel = reaction.message.guild.channels.cache.find(channel => channel.name.includes(server.channels.highlightBoard));

      if (highlightBoardChannel) {

        let author = server.members.get(reaction.message.member.id);
        if (!author) author = JSON.parse(JSON.stringify(memberConfig));

        author.exp += expAddends.highlight;

        server.members.set(reaction.message.member.id, author);
        Bot.servers.set(reaction.message.guild.id, server);

        let attachment = null;
        if (reaction.message.attachments.first()) {
          attachment = reaction.message.attachments.first().url;
        }

        const botEmbed = new Discord.MessageEmbed()
          .setAuthor(reaction.message.author.username, reaction.message.author.displayAvatarURL())
          .setColor(botConfig.COLOR)
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
