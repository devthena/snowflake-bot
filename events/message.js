const CONSTANTS = require('../constants/general');

module.exports = (Bot, message) => {

  if (message.author.bot) return;
  if (message.channel.type !== 'text') return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (Bot.isTrue(server.mods.highlightBoard)) {
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
      }, 3600000);
      server.messageTimers.set(message.id, timer);
    }
  }

  if (message.content.indexOf(CONSTANTS.PREFIX) !== 0 && message.member) {

    const words = message.content.split(/ +/g);
    const pattern = new RegExp('[A-Za-z].{2,}');
    let member = server.members.get(message.member.id);

    if (!member) member = { points: 0 };

    words.forEach(word => {
      let match = pattern.test(word);
      if (match) {
        member.points++;
      }
    });

    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);

  } else {

    const args = message.content.slice(CONSTANTS.PREFIX.length).trim().split(/ +/g);
    const comm = args.shift().toLowerCase();

    const command = Bot.commands.get(comm);
    if (!command) return;
    if (!command.conf.enabled) return;

    let permitParams = {
      permitLevel: command.conf.permitLevel,
      message: message,
      server: server
    };

    if (Bot.hasCommandPermit(permitParams)) {

      if (Bot.cooldowns.indexOf(command.info.name) < 0) {

        command.run(Bot, message, args);
        Bot.cooldowns.push(command.info.name);

        setTimeout(function () {
          let commIndex = Bot.cooldowns.indexOf(command.info.name);
          Bot.cooldowns.splice(commIndex, 1);
        }, command.conf.cooldown * 1000);
      }
    }
  }
};
