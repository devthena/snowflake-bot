const { CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
const weightedRandom = require('../helpers/weightedRandom');

module.exports = (member, winPercent, interaction) => {

  const notices = {
    invalidInput: `Please enter a specific amount or a value of 'all' or 'half'. :wink:`,
    invalidNegative: `You should gamble at least 1 ${CURRENCY}, goob. :wink:`,
    lostAll: `${interaction.member.displayName} lost all of their ${CURRENCY_TEXT}. :money_with_wings:`,
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to gamble. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${CURRENCY_TEXT} to gamble. :neutral_face:`
  };

  const amount = interaction.options.getString('amount');
  if(isNaN(amount) && amount !== 'all' && amount !== 'half') return { message: notices.invalidInput };

  const probability = { win: (winPercent / 100), loss: (1 - (winPercent / 100)) };

  if (member.points < 1) return { message: notices.noPoints };

  const result = weightedRandom(probability);
  let updates = { points: member.points };

  if (amount === 'all') {

    if (result === 'win') {
      updates.points += member.points;
      return {
        message: `${interaction.member.displayName} won ${points} :moneybag: and now has ${updates.points} ${CURRENCY}! :sparkles:`,
        updates
      };
    }
    
    updates.points = 0;

    return {
      message: notices.lostAll,
      updates
    };

  }
  
  if (amount === 'half') {

    const halfPoints = Math.round(member.points / 2);

    if (result === 'win') {
      updates.points += halfPoints;
      return {
        message: `${interaction.member.displayName} won ${halfPoints} :moneybag: and now has ${updates.points} ${CURRENCY}!`,
        updates
      };
    }
    
    updates.points -= halfPoints;

    return {
      message: `${interaction.member.displayName} lost ${halfPoints} :money_with_wings: and now has ${updates.points} ${CURRENCY}.`,
      updates
    };
  }

  const value = parseInt(amount, 10);
  if (value < 1) return { message: notices.invalidNegative };

  if (points > 0) {

    if (value <= points) {

      if (result === 'win') {
        updates.points += value;
        return {
          message: `${interaction.member.displayName} won ${value} :moneybag: and now has ${updates.points} ${CURRENCY}!`,
          updates
        };
      }
      
      updates.points -= value;
      return {
        message: `${interaction.member.displayName} lost ${value} :money_with_wings: and now has ${updates.points} ${CURRENCY}.`,
        updates
      };
    }
    
    return { message: notices.notEnough };
  }
  
  return { message: notices.noPoints };
};