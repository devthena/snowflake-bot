const botConfig = require('../constants/botConfig');
const isTrue = require('../helpers/isTrue');
const hasPermission = require('../helpers/hasPermission');

/**
 * Runs commands, add points to users, and tracks messages for the highlight board
 * @listens event:message
 * @param {ClientUser} Bot 
 * @param {Message} message 
 */
module.exports = (Bot, message) => {

  if (message.channel.type !== 'text') return;

  if (!message.guild.available) return;

  if (message.author.bot) return;

  if (message.author.system) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (isTrue(server.mods.highlightBoard)) {
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

  if (message.content.indexOf(botConfig.PREFIX) !== 0 && message.member) {

    const words = message.content.split(/ +/g);
    const pattern = new RegExp('[A-Za-z].{2,}');
    let member = server.members.get(message.member.id);

    if (!member) member = {
      level: 1,
      exp: 0,
      points: 0,
      stars: 0
    };

    words.forEach(word => {
      let match = pattern.test(word);
      if (match) {
        member.points++;
      }
    });

    server.members.set(message.member.id, member);
    Bot.servers.set(message.guild.id, server);

  } else {

    const args = message.content.slice(botConfig.PREFIX.length).trim().split(/ +/g);
    const comm = args.shift().toLowerCase();

    const command = Bot.commands.get(comm);
    if (!command) return;
    if (!command.conf.enabled) return;

    if (hasPermission(message, command.conf.permitLevel, server.roles)) {

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
