const expAddends = require('../constants/expAddends');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Runs commands, add points to users, and tracks messages for the highlight board
 * @listens event:message
 * @param {Client} Bot 
 * @param {Message} message 
 */
module.exports = async (Bot, message) => {

  if (message.channel.type !== 'GUILD_TEXT') return;
  if (!message.guild?.available) return;
  if (message.author.bot) return;
  if (message.author.system) return;
  if (!message.member) return;

  const words = message.content.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  let member = await Bot.db.collection('members').findOne({ userId: message.member.id });
  if(!member) {
    member = {
      userId: message.member.id,
      serverId: message.guildId,
      ...memberConfig
    };
    await Bot.db.collection('members').insertOne(member);
  }

  let addend = 0;
  let points = member.points;

  words.forEach(word => {
    const match = pattern.test(word);
    if (match) points++;
  });

  if (!/bot-/.test(message.channel.name)) {

    if (words.length > 1) addend += expAddends.message;
    if (message.attachments.first()) addend += expAddends.attachment;

    const hasSubscriberRole = message.member.roles.cache.find(role => role.name.toLowerCase().includes('subscriber'));
    const hasNitroBoosterRole = message.member.premiumSince;

    if (hasSubscriberRole) addend += expAddends.subscriber;
    if (hasNitroBoosterRole) addend += expAddends.nitroBooster;
  }

  let updates = updateLevel(member, addend, message.member.displayName, message.guild.channels);
  if(!updates) updates = { points };
  else updates.points = points;

  await Bot.db.collection('members').updateOne({ userId: message.member.id }, { $set: { ...updates } });
};
