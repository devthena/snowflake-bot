const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const updateLevel = require('../helpers/user/updateLevel');

/**
 * Runs commands, add points to users, and tracks messages for the highlight board
 * @listens event:message
 * @param {Client} Bot 
 * @param {Message} message 
 */
module.exports = (Bot, message) => {

  if (message.channel.type !== 'text') return;
  if (!message.guild.available) return;
  if (message.author.bot) return;
  if (message.author.system) return;

  const server = Bot.servers.get(message.guild.id);
  if (!server) return;

  if (!message.member) return;

  const words = message.content.split(/ +/g);
  const pattern = new RegExp('[A-Za-z].{2,}');

  let member = server.members.get(message.member.id) || null;
  if (!member) member = JSON.parse(JSON.stringify(memberConfig));

  words.forEach(word => {
    const match = pattern.test(word);
    if (match) member.points++;
  });

  if (!/bot-/.test(message.channel.name)) {

    if (words.length > 1) member.exp += expAddends.message;
    if (message.attachments.first()) member.exp += expAddends.attachment;

    const hasSubscriberRole = message.member.roles.cache.find(role => role.name.toLowerCase().includes('subscriber'));
    const hasNitroBoosterRole = message.member.premiumSince;

    if (hasSubscriberRole) member.exp += expAddends.subscriber;
    if (hasNitroBoosterRole) member.exp += expAddends.nitroBooster;
  }

  const updatedMember = updateLevel(member, message.member.displayName, message.guild.channels);
  server.members.set(message.member.id, updatedMember);
  Bot.servers.set(message.guild.id, server);
};
