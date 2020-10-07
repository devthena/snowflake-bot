const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');

/**
 * Removes EXP for users who remove their reactions
 * @listens event:messageReactionRemove
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
  else member.exp += expAddends.reactionRemove;

  server.members.set(user.id, member);
  Bot.servers.set(reaction.message.guild.id, server);
};
