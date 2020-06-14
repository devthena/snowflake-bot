
const Discord = require('discord.js');
const types = require('./../constants/activity-types');

module.exports = (Bot, oldPresence, newPresence) => {

  if (!newPresence.guild.available) return;

  const server = Bot.servers.get(newPresence.guild.id);
  if (!server) return;

  let liveRole = newPresence.guild.roles.cache.find(role => role.name.includes('Now Live'));
  let newMember = newPresence.member;

  // member went offline
  if (newPresence.status === 'offline') {
    if (liveRole && newMember.roles.cache.has(liveRole.id)) {
      newMember.roles.remove(liveRole)
        .then(function () {
          Bot.logger.info(`${newMember.displayName} went offline.`);
        }).catch(function (error) {
          Bot.logger.error(`presenceUpdate: ${error}`);
        });
    }
    return;
  }

  // member has activities
  if (newPresence.activities.length) {

    // member has started streaming
    const isStreaming = newPresence.activities.some(activity => activity.type === types.streaming);
    const hasBeenStreaming = oldPresence ? oldPresence.activities.some(activity => activity.type === types.streaming) : false;

    if (!hasBeenStreaming && isStreaming) {

      if (liveRole && !newMember.roles.cache.has(liveRole.id)) {
        newMember.roles.add(liveRole)
          .then(function () {
            Bot.logger.info(`${newMember.displayName} started streaming.`);
          }).catch(function (error) {
            Bot.logger.error(`presenceUpdate: ${error}`);
          });
      }

      // stream announcements for server owners
      if (Bot.isTrue(server.mods.alertStream) && newPresence.guild.ownerID === newMember.id) {

        const streamActivity = newPresence.activities.find(activity => activity.type === types.streaming);
        const alertStreamChannel = newPresence.guild.channels.cache.find(channel => channel.name.includes(server.channels.alertStream));

        if (streamActivity && alertStreamChannel) {

          let liveMessage = '';
          if (streamActivity.details) liveMessage += streamActivity.details;
          if (streamActivity.url) liveMessage += `\n\n${streamActivity.url}`;

          let liveImage = streamActivity.assets ? streamActivity.assets.largeImageURL() : null;

          const botEmbed = new Discord.MessageEmbed()
            .setAuthor(newMember.user.username, newMember.user.displayAvatarURL())
            .setColor('#FFBFFA')
            .setTitle(`Now Streaming ${streamActivity.state}`)
            .setDescription(liveMessage)
            .setImage(liveImage)
            .setFooter(`Posted on ${streamActivity.createdAt.toDateString()}`);

          alertStreamChannel.send(botEmbed)
            .then(() => { alertStreamChannel.send('@everyone'); })
            .catch(error => Bot.logger.error(`presenceUpdate: ${error}`));
        }
      }

    } else if (hasBeenStreaming && !isStreaming) {

      // member stopped streaming
      if (liveRole && newMember.roles.cache.has(liveRole.id)) {
        newMember.roles.remove(liveRole)
          .then(function () {
            Bot.logger.info(`${newMember.displayName} is done streaming.`);
          }).catch(function (error) {
            Bot.logger.error(`presenceUpdate: ${error}`);
          });
      }
    }

  } else {

    if (liveRole && newMember.roles.cache.has(liveRole.id)) {
      newMember.roles.remove(liveRole)
        .then(function () {
          Bot.logger.info(`${newMember.displayName} is done streaming.`);
        }).catch(function (error) {
          Bot.logger.error(`presenceUpdate: ${error}`);
        });
    }
  }

};
