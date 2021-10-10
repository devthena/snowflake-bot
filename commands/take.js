const { CURRENCY } = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

module.exports = async (Bot, interaction) => {

  const amount = interaction.options.getInteger('amount');
  const recipient = interaction.options.getMember('user');

  const notices = {
    invalidInput: `${interaction.member.displayName}, you can't take ${amount} ${CURRENCY}, goob. :wink:`,
    noPoints: `${recipient.displayName} already has 0 points. :neutral_face:`
  };

  if (amount <= 0) {
    try {
      await interaction.reply(notices.invalidInput);
    } catch(err) { console.error(err); }
  };

  if(recipientData.points === 0) {
    try {
      await interaction.reply(notices.noPoints);
    } catch(err) { console.error(err); }
  };

  if(recipient.id === Bot.user.id) {
    try {
      await interaction.reply(`Sorry ${interaction.member.displayName}, you can't take points from me. :snowflake:`);
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

  let updates = { points: recipientData.points };

  if (amount > recipientData.points) updates.points = 0;

  updates.points -= amount;

  try {
    await interaction.reply(`${interaction.member.displayName}, you have taken ${amount} ${CURRENCY} from ${recipient.displayName}`);
    await Bot.db.collection('members').updateOne({ userId: recipient.id }, { $set: { ...updates } });
  } catch(err) { console.error(err); }

};