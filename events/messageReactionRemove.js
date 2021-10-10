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
module.exports = async (Bot, reaction, user) => {

  const message = reaction.message;

  if (message.channel.type !== 'GUILD_TEXT') return;
  if (!message.guild?.available) return;
  if (message.author.bot || user.bot || message.author.system) return;

  try {

    let member = await Bot.db.collection('members')
      .findOne({ userId: user.id, serverId: message.guildId });
    if(!member) {
      member = {
        userId: user.id,
        serverId: message.guildId,
        ...memberConfig
      };
      await Bot.db.collection('members').insertOne(member);
    }

    let updates = {};

    if (member.exp > 0) {
      updates.exp = member.exp + expAddends.reactionRemove;
    } else if (member.level > 1) {
      updates.level = member.level - 1;
      updates.exp = (member.level * LVL_MULTIPLIER) + expAddends.reactionRemove;
    } else {
      updates = null;
    }

    if(updates) await Bot.db.collection('members').updateOne({ userId: user.id }, { $set: { ...updates } });

  } catch(err) { console.error(err); }

};
