const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Tracks the number of reactions of messages for posting in highlight board
 * @listens event:messageReactionAdd
 * @param {ClientUser} Bot 
 * @param {MessageReaction} reaction 
 * @param {User} user 
 */
module.exports = (Bot, reaction, user) => {

  const message = reaction.message;

  if (message.channel.type !== 'text') return;

  if (!message.guild.available) return;

  if (message.author.bot || user.bot || message.author.system) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  let member = server.members.get(user.id);
  if (!member) member = JSON.parse(JSON.stringify(memberConfig));

  member.exp += expAddends.reactionAdd;

  const updatedMember = updateLevel(member, user.username, message.guild.channels.cache);
  server.members.set(user.id, updatedMember);
  Bot.servers.set(message.guild.id, server);

  if (isTrue(server.mods.highlightBoard)) {
    if (!server.messageTrackIds) return;
    if (server.messageTrackIds && server.messageTrackIds.indexOf(message.id) < 0) return;

    if (reaction.count >= 5) {

      const highlightBoardChannel = message.guild.channels.cache.find(channel => channel.name.includes(server.channels.highlightBoard));

      if (highlightBoardChannel) {

        let author = server.members.get(message.author.id);
        if (!author) author = JSON.parse(JSON.stringify(memberConfig));

        author.exp += expAddends.highlight;

        let displayName = message.member ? message.member.displayName : message.author.username;
        const updatedAuthor = updateLevel(author, displayName, message.guild.channels.cache);
        server.members.set(message.author.id, updatedAuthor);
        Bot.servers.set(message.guild.id, server);

        let attachment = null;
        if (message.attachments.first()) {
          attachment = message.attachments.first().url;
        }

        const botEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor(botConfig.COLOR)
          .setDescription(`${message.cleanContent}\n\nLink for [original message](${message.url}) in ${message.channel}`)
          .setImage(attachment)
          .setFooter(`Posted on ${message.createdAt}`);
        highlightBoardChannel.send(botEmbed);
      }

      let index = server.messageTrackIds.indexOf(message.id);
      server.messageTrackIds.splice(index, 1);
      let timer = server.messageTimers.get(message.id);
      if (timer) clearTimeout(timer);
    }
  }

};
