
module.exports = (Bot, oldMember, newMember) => {

  const server = Bot.servers.get(newMember.guild.id);
  if (!server) return;

  let liveRole = newMember.guild.roles.find(role => role.name.includes('Now Live'));
  // let validLive = false;
  // let gameSwitch = false;

  // member went offline
  if (newMember.presence.status == 'offline') {
    if (liveRole && newMember.roles.has(liveRole.id)) {
      newMember.removeRole(liveRole)
        .then(function () {
          Bot.logger.info(`${newMember.displayName} is done streaming.`);
        }).catch(function (error) {
          Bot.logger.error(`Presence Offline - ${error}`);
        });
    }
    return;
  }

  // member has a game presence upon changing status
  if (newMember.presence.game) {

    // member has started streaming
    if (newMember.presence.game.streaming) {
      if (liveRole && !newMember.roles.has(liveRole.id)) {
        newMember.addRole(liveRole)
          .then(function () {
            Bot.logger.info(`${newMember.displayName} is done streaming.`);
          }).catch(function (error) {
            Bot.logger.error(`Presence Offline - ${error}`);
          });
      }
      return;
    } else if (oldMember.presence.game) {

      // member stopped streaming
      if (oldMember.presence.game.streaming) {
        if (liveRole && newMember.roles.has(liveRole.id)) {
          newMember.removeRole(liveRole)
            .then(function () {
              Bot.logger.info(`${newMember.displayName} is done streaming.`);
            }).catch(function (error) {
              Bot.logger.error(`Presence Offline - ${error}`);
            });
        }
        return;
      }
    }
  }

  // member has no game presence upon changing status
  if (!newMember.presence.game) {
    if (oldMember.presence.game) {
      if (oldMember.presence.game.streaming) {
        if (liveRole && newMember.roles.has(liveRole.id)) {
          newMember.removeRole(liveRole)
            .then(function () {
              Bot.logger.info(`${newMember.displayName} is done streaming.`);
            }).catch(function (error) {
              Bot.logger.error(`Presence Offline - ${error}`);
            });
        }
        return;
      }
    }
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
