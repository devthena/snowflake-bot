const botConfig = require('../constants/botConfig');

module.exports = (memberData, recipientData, interaction) => {

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  const notices = {
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${currencyText} to give. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${currencyText} to give. :neutral_face:`
  };

  const amount = interaction.options.getInteger('amount');
  if (amount <= 0) return { message: `${interaction.member.displayName}, you can't give ${amount} ${currency}, goob. :wink:` };

  if (memberData.points < amount && interaction.member.id !== interaction.guild.ownerId) {
    return { message: notices.notEnough };
  }

  let recipient = interaction.options.getMember('user');
  let recipientCopy = `${recipient.displayName}.`;

  if (interaction.member.id === recipient.id) recipientCopy = 'yourself. :smirk:';

  if (interaction.member.id !== interaction.guild.ownerId) {
    memberData.points -= amount;
  }

  recipientData.points += amount;

  return {
    message: `${interaction.member.displayName}, you have given ${amount} ${currency} to ${recipientCopy}`,
    updatedMember: memberData,
    updatedRecipient: recipientData
  };

};