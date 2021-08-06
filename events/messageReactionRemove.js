const { LVL_MULTIPLIER } = require('../constants/botConfig');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');

/**
 * Removes EXP for users who remove their reactions
 * @listens event:messageReactionRemove
 * @param {Client} Bot 
 * @param {MessageReaction} reaction 
 * @param {User} user 
 */
module.exports = (Bot, reaction, user) => {

  const message = reaction.message;

  if (message.channel.type !== 'GUILD_TEXT') return;
  if (!message.guild?.available) return;
  if (message.author.bot || user.bot || message.author.system) return;

  const server = Bot.servers.get(message.guildId);
  if (!server) return;

  let member = server.members.get(user.id);
  if (!member) {
    member = JSON.parse(JSON.stringify(memberConfig));
  } else {
    if (member.exp > 0) {
      member.exp += expAddends.reactionRemove;
    } else if (member.level > 1) {
      member.level -= 1;
      member.exp = (member.level * LVL_MULTIPLIER) + expAddends.reactionRemove;
    }
  }

  server.members.set(user.id, member);
  Bot.servers.set(message.guildId, server);
};
