const { CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

module.exports = async (Bot, member, interaction) => {

  const notices = {
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to give. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${CURRENCY_TEXT} to give. :neutral_face:`
  };

  if (member.points < 1) {
    try {
      await interaction.reply(notices.noPoints);
    } catch(err) { console.error(err); }
    return;
  }

  const recipient = interaction.options.getMember('user');
  
  if(recipient.id === Bot.user.id) {
    try {
      await interaction.reply(`Sorry ${interaction.member.displayName}, I have no use for points. Please keep it! :snowflake:`);
    } catch(err) { console.error(err); }
    return;
  }

  let recipientData = await Bot.db.collection('members').findOne({ userId: recipient.id });
  if(!recipientData) {
    recipientData = {
      userId: recipient.id,
      serverId: interaction.guildId,
      ...memberConfig
    };
    await Bot.db.collection('members').insertOne(recipientData);
  }

  const amount = interaction.options.getInteger('amount');

  if (amount < 1) {
    try {
      await interaction.reply(`${interaction.member.displayName}, you can't give ${amount} ${CURRENCY}, goob. :wink:`);
    } catch(err) { console.error(err); }
    return;
  };

  if (member.points < amount && interaction.member.id !== interaction.guild.ownerId) {
    try {
      await interaction.reply(notices.notEnough);
    } catch(err) { console.error(err); }
    return;
  }

  let recipientCopy = `${recipient.displayName}.`;
  if (interaction.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  let updates = { points: member.points };
  let recipientUpdates = { points: recipientData.points };

  if (interaction.member.id !== interaction.guild.ownerId) {
    updates.points -= amount;
  }

  recipientUpdates.points += amount;

  try {
    await interaction.reply(`${interaction.member.displayName}, you have given ${amount} ${CURRENCY} to ${recipientCopy}`);
    await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...updates } });
    await Bot.db.collection('members').updateOne({ userId: recipient.id }, { $set: { ...recipientUpdates } });
  } catch(err) { console.error(err); }

};