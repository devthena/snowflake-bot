const botConfig = require('../constants/botConfig');
const weightedRandom = require('../helpers/weightedRandom');

module.exports = (memberData, winPercent, interaction) => {

  const currency = botConfig.CURRENCY;
  const currencyText = botConfig.CURRENCY_TEXT;

  const notices = {
    invalidInput: `Please enter a specific amount or a value of 'all' or 'half'. :wink:`,
    invalidNegative: `You should gamble at least 1 ${currency}, goob. :wink:`,
    lostAll: `${interaction.member.displayName} lost all of their ${currencyText}. :money_with_wings:`,
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${currencyText} to gamble. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${currencyText} to gamble. :neutral_face:`
  };

  const amount = interaction.options.getString('amount');
  if(isNaN(amount) && amount !== 'all' && amount !== 'half') return { message: notices.invalidInput };

  const probability = { win: (winPercent / 100), loss: (1 - (winPercent / 100)) };

  const points = parseInt(memberData.points, 10);

  if (points < 1) return { message: notices.noPoints };

  const result = weightedRandom(probability);

  if (amount === 'all') {

    if (result === 'win') {
      memberData.points += points;
      return {
        message: `${interaction.member.displayName} won ${points} :moneybag: and now has ${memberData.points} ${currency}! :sparkles:`,
        updatedMember: memberData
      };
    }
    
    memberData.points = 0;

    return {
      message: notices.lostAll,
      updatedMember: memberData
    };

  }
  
  if (amount === 'half') {

    const halfPoints = Math.round(points / 2);

    if (result === 'win') {
      memberData.points += halfPoints;
      return {
        message: `${interaction.member.displayName} won ${halfPoints} :moneybag: and now has ${memberData.points} ${currency}!`,
        updatedMember: memberData
      };
    }
    
    memberData.points -= halfPoints;

    return {
      message: `${interaction.member.displayName} lost ${halfPoints} :money_with_wings: and now has ${memberData.points} ${currency}.`,
      updatedMember: memberData
    };
  }

  const value = parseInt(amount, 10);
  if (value < 1) return { message: notices.invalidNegative };

  if (points > 0) {

    if (value <= points) {

      if (result === 'win') {
        memberData.points += value;
        return {
          message: `${interaction.member.displayName} won ${value} :moneybag: and now has ${memberData.points} ${currency}!`,
          updatedMember: memberData
        };
      }
      
      memberData.points -= value;
      return {
        message: `${interaction.member.displayName} lost ${value} :money_with_wings: and now has ${memberData.points} ${currency}.`,
        updatedMember: memberData
      };
    }
    
    return { message: notices.notEnough };
  }
  
  return { message: notices.noPoints };
};