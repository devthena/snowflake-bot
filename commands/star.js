
const { MessageEmbed } = require('discord.js');
const { YELLOW } = require('../constants/discordColors');
const expAddends = require('../constants/expAddends');
const memberConfig = require('../constants/memberConfig');
const updateLevel = require('../helpers/user/updateLevel');

module.exports = async (Bot, member, interaction) => {

  if(member.level < 2) {
    try {
      await interaction.reply('You need to be at least level 2 to use this command.');
    } catch(err) { console.error(err); }
    return;
  }

  const notices = {
    invalidMax: `${interaction.member.displayName}, you can only give one star per day.`,
    invalidSelf: `${interaction.member.displayName}, you can't give yourself a star, goob.`
  };

  const now = new Date();
  const today = `${ now.getFullYear() }-${ now.getMonth() + 1 }-${ now.getDate() }`;

  const recipient = interaction.options.getMember('user');

  try {
    if (interaction.member.id === recipient.id) return await interaction.reply(notices.invalidSelf);
    if (member.lastStar === today) return await interaction.reply(notices.invalidMax);
  } catch(err) { console.error(err); }

  let recipientData = await Bot.db.collection('members').findOne({ userId: recipient.id });
  if(!recipientData) {
    recipientData = {
      userId: recipient.id,
      serverId: interaction.guildId,
      ...memberConfig
    };
    await Bot.db.collection('members').insertOne(recipientData);
  }

  let recipientUpdates = updateLevel(recipientData, expAddends.starred, recipient.displayName, interaction.guild.channels);
  if(!recipientUpdates) recipientUpdates = { stars: recipientData.stars + 1 };
  else recipientUpdates.stars = recipientData.stars + 1;

  const botEmbed = new MessageEmbed()
    .setTitle('Daily Star Sent!')
    .setDescription(`${recipient.displayName} got a star from ${interaction.member.displayName}!\n\nThey also got +100 EXP as a bonus. :sparkles:`)
    .setColor(YELLOW)
    .setFooter(`Star given on ${now}`);

  try {
    await interaction.reply({ embeds: [ botEmbed ] });
    await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { lastStar: today } });
    await Bot.db.collection('members').updateOne({ userId: recipient.id }, { $set: { ...recipientUpdates } });
  } catch(err) { console.error(err); }

};