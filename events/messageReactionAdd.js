const Discord = require('discord.js');
const botConfig = require('../constants/botConfig');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const isTrue = require('../helpers/isTrue');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Tracks the number of reactions of messages for posting in highlight board
 * @listens event:messageReactionAdd
 * @param {Client} Bot 
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

  const reactUser = message.guild.member(user);
  const displayName = reactUser ? reactUser.displayName : user.username;
  const updatedMember = updateLevel(member, displayName, message.guild.channels);
  
  server.members.set(user.id, updatedMember);
  Bot.servers.set(message.guild.id, server);

  if (isTrue(server.mods.highlightBoard)) {

    const highlightIgnoreList = server.channels.highlightIgnore.split(',');
    const highlightIgnoreChannel = highlightIgnoreList.find(keyword => message.channel.name.includes(keyword));

    if (highlightIgnoreChannel) return;

    if (reaction.count === 1 && message.reactions.cache.size === 1) {

      const hourTS = 3600000;
      const currentTS = Date.now();
      const diffTS = currentTS - message.createdTimestamp;

      if (diffTS > hourTS) return;

      if (!server.messageTrackIds) {
        server.messageTrackIds = [];
        server.messageTimers = new Map();
      }

      if (server.messageTrackIds.indexOf(message.id) < 0) {
        server.messageTrackIds.push(message.id);
        let timer = setTimeout(() => {
          let index = server.messageTrackIds.indexOf(message.id);
          server.messageTrackIds.splice(index, 1);
          server.messageTimers.delete(message.id);
        }, (hourTS - diffTS));
        server.messageTimers.set(message.id, timer);
      }

    } else if (reaction.count >= 5) {

      if (!server.messageTrackIds) return;
      if (server.messageTrackIds.indexOf(message.id) < 0) return;

      const highlightBoardChannel = message.guild.channels.cache.find(channel => channel.name.includes(server.channels.highlightBoard));

      if (highlightBoardChannel) {

        let author = server.members.get(message.author.id);
        if (!author) author = JSON.parse(JSON.stringify(memberConfig));

        author.exp += expAddends.highlight;

        let displayName = message.member ? message.member.displayName : message.author.username;
        const updatedAuthor = updateLevel(author, displayName, message.guild.channels);
        server.members.set(message.author.id, updatedAuthor);
        Bot.servers.set(message.guild.id, server);

        let imageUrl = null;
        let description = `${message.cleanContent}\n\nLink for [original message](${message.url}) in ${message.channel}`;

        if(message.embeds.length > 0) {

          let embed = message.embeds[0];
          if(embed) imageUrl = embed.thumbnail ? embed.thumbnail.url : embed.image;

        }
        
        if (!imageUrl && message.attachments.first()) {
          
          const attachmentUrl = message.attachments.first().url;
          if (!/SPOILER_/.test(attachmentUrl)) {
            imageUrl = attachmentUrl;
          } else {
            description += `\nNote: Contains SPOILER Image`;
          }
        }

        const botEmbed = new Discord.MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor(botConfig.COLOR)
          .setDescription(description)
          .setImage(imageUrl)
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
