const { CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');

module.exports = (member, recipientData, interaction) => {

  const notices = {
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to give. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${CURRENCY_TEXT} to give. :neutral_face:`
  };

  const amount = interaction.options.getInteger('amount');
  if (amount <= 0) return { message: `${interaction.member.displayName}, you can't give ${amount} ${CURRENCY}, goob. :wink:` };

  if (member.points < amount && interaction.member.id !== interaction.guild.ownerId) {
    return { message: notices.notEnough };
  }

  let recipient = interaction.options.getMember('user');
  let recipientCopy = `${recipient.displayName}.`;

  if (interaction.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  let updates = { points: member.points };
  let recipientUpdates = { points: recipientData.points };

  if (interaction.member.id !== interaction.guild.ownerId) {
    updates.points -= amount;
  }

  recipientUpdates.points += amount;

  return {
    message: `${interaction.member.displayName}, you have given ${amount} ${CURRENCY} to ${recipientCopy}`,
    updates,
    recipientUpdates
  };

};