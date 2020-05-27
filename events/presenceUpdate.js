
const types = require('./../constants/activity-types');

module.exports = (Bot, oldPresence, newPresence) => {

  const server = Bot.servers.get(newPresence.guild.id);
  if (!server) return;

  let liveRole = newPresence.guild.roles.cache.find(role => role.name.includes('Now Live'));
  let newMember = newPresence.member;
  // let validLive = false;
  // let gameSwitch = false;

  // member went offline
  if (newPresence.status === 'offline') {
    if (liveRole && newPresence.guild.roles.cache.has(liveRole.id)) {
      newMember.roles.remove(liveRole)
        .then(function () {
          Bot.logger.info(`${newMember.displayName} is done streaming.`);
        }).catch(function (error) {
          Bot.logger.error(`Presence Offline - ${error}`);
        });
    }
    return;
  }

  // member has activities
  if (newPresence.activites) {

    // member has started streaming
    const isStreaming = newPresence.activites.some(activity => activity.type === types.streaming);
    const hasBeenStreaming = oldPresence.activites.some(activity => activity.type === types.streaming);
    // TODO: store the activity info for stream announcement
    if (!hasBeenStreaming && isStreaming) {
      if (liveRole && !newMember.roles.cache.has(liveRole.id)) {
        newMember.roles.add(liveRole)
          .then(function () {
            Bot.logger.info(`${newMember.displayName} is done streaming.`);
          }).catch(function (error) {
            Bot.logger.error(`Presence Offline - ${error}`);
          });
      }
      return;

    } else if (hasBeenStreaming && !isStreaming) {

      // member stopped streaming
      if (liveRole && newMember.roles.cache.has(liveRole.id)) {
        newMember.roles.remove(liveRole)
          .then(function () {
            Bot.logger.info(`${newMember.displayName} is done streaming.`);
          }).catch(function (error) {
            Bot.logger.error(`Presence Offline - ${error}`);
          });
      }
      return;
    }
  }

  // member has no activities
  else {
    if (liveRole && newMember.roles.cache.has(liveRole.id)) {
      newMember.roles.remove(liveRole)
        .then(function () {
          Bot.logger.info(`${newMember.displayName} is done streaming.`);
        }).catch(function (error) {
          Bot.logger.error(`Presence Offline - ${error}`);
        });
    }
    return;
  }

  // if (oldMember.presence.game) {

  //     if (!oldMember.presence.game.streaming) {
  //         validLive = true;
  //     } else {
  //         if (oldMember.presence.game.details !== newMember.presence.game.details) gameSwitch = true;
  //         else return;
  //     }

  // } else {
  //     validLive = true;
  // }

  // if (Bot.isTrue(server.mods.alertStream) && newMember.guild.ownerID === newMember.id) {

  //     const game = newMember.presence.game.details;
  //     const title = newMember.presence.game.name;
  //     const url = newMember.presence.game.url;
  //     const user = newMember.user.username;
  //     let finalMessage = null;

  //     const alertStreamChannel = newMember.guild.channels.find(channel => channel.name.includes(server.channels.alertStream));
  //     if (!alertStreamChannel) return Bot.logger.error('[SYS] Cannot find specified alert stream channel in the server');

  //     if (gameSwitch) {

  //         const switchMessage = `${user} switched the game to ${game}!`;
  //         Bot.logger.info(`[LIVE] ${user}: Switched game to ${game}`);
  //         finalMessage = switchMessage;

  //     } else if (validLive) {

  //         const liveMessage = server.messages.alertStream
  //             .replace('{game}', game)
  //             .replace('{title}', title)
  //             .replace('{url}', url)
  //             .replace('{user}', user);

  //         Bot.logger.info(`[LIVE] ${user}: ${url}`);
  //         finalMessage = liveMessage;
  //     }

  //     if (!finalMessage) return;
  //     alertStreamChannel.send(finalMessage).catch(error => {
  //         Bot.logger.error(`${error}`);
  //     });
  // }

};
