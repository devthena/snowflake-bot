const { CURRENCY } = require('../constants/botConfig');

module.exports = (recipientData, interaction) => {

  const amount = interaction.options.getInteger('amount');
  const recipient = interaction.options.getMember('user');

  const notices = {
    invalidInput: `${interaction.member.displayName}, you can't take ${amount} ${CURRENCY}, goob. :wink:`,
    noPoints: `${recipient.displayName} already has 0 points. :neutral_face:`
  };

  if (amount <= 0) return { message: notices.invalidInput };
  if(recipientData.points === 0) return { message: notices.noPoints };

  if (amount > recipientData.points) amount = recipientData.points;
  recipientData.points -= amount;

  return {
    message: `${interaction.member.displayName}, you have taken ${amount} ${CURRENCY} from ${recipient.displayName}`,
    updatedRecipient: recipientData
  };

};