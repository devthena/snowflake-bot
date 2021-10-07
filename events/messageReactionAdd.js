const { MessageEmbed } = require('discord.js');
const { COLOR } = require('../constants/botConfig');
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
module.exports = async (Bot, reaction, user) => {

  const message = reaction.message;

  if (message.channel.type !== 'GUILD_TEXT') return;
  if (!message.guild?.available) return;
  if (message.author.bot || user.bot || message.author.system) return;

  const server = Bot.servers.get(message.guildId);
  if (!server) return;

  let member = await Bot.db.collection('members').findOne({ userId: user.id });
  if(!member) {
    member = {
      userId: user.id,
      serverId: message.guildId,
      ...memberConfig
    };
    await Bot.db.collection('members').insertOne(member);
  }

  const reactUser = message.guild.members.cache.get(user.id);
  const displayName = reactUser ? reactUser.displayName : user.username;

  let updates = updateLevel(member, expAddends.reactionAdd, displayName, message.guild.channels);
  if(!updates) updates = { exp: member.exp + expAddends.reactionAdd };

  await Bot.db.collection('members').updateOne({ userId: user.id }, { $set: { ...updates } });

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

        let author = await Bot.db.collection('members').findOne({ userId: message.author.id });
        if(!author) {
          author = {
            userId: message.author.id,
            serverId: message.guildId,
            ...memberConfig
          };
          await Bot.db.collection('members').insertOne(author);
        }

        const displayName = message.member ? message.member.displayName : message.author.username;

        let authorUpdates = updateLevel(author, expAddends.highlight, displayName, message.guild.channels);
        if(!authorUpdates) authorUpdates = { exp: author.exp += expAddends.highlight };

        await Bot.db.collection('members').updateOne({ userId: message.author.id }, { $set: { ...authorUpdates } });

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

        const botEmbed = new MessageEmbed()
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setColor(COLOR)
          .setDescription(description)
          .setImage(imageUrl)
          .setFooter(`Posted on ${message.createdAt}`);
        highlightBoardChannel.send({ embeds: [botEmbed] });
      }

      let index = server.messageTrackIds.indexOf(message.id);
      server.messageTrackIds.splice(index, 1);
      let timer = server.messageTimers.get(message.id);
      if (timer) clearTimeout(timer);
    }
  }

};
