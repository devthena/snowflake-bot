const { CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
const isTrue = require('../helpers/isTrue');
const weightedRandom = require('../helpers/weightedRandom');

module.exports = async (member, server, interaction) => {

  if (!isTrue(server.mods.gameGamble)) {
    try {
      await interaction.reply('Gambling is not enabled in this server.');
    } catch(err) { console.error(err); }
    return;
  }

  const notices = {
    invalidInput: `Please enter a specific amount or a value of 'all' or 'half'. :wink:`,
    invalidNegative: `You should gamble at least 1 ${CURRENCY}, goob. :wink:`,
    lostAll: `${interaction.member.displayName} lost all of their ${CURRENCY_TEXT}. :money_with_wings:`,
    noPoints: `Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to gamble. :neutral_face:`,
    notEnough: `Sorry ${interaction.member.displayName}, you don't have that many ${CURRENCY_TEXT} to gamble. :neutral_face:`
  };

  if (member.points < 1) {
    try {
      await interaction.reply(notices.noPoints);
    } catch(err) { console.error(err); }
    return;
  }

  const amount = interaction.options.getString('amount');

  if(isNaN(amount) && amount !== 'all' && amount !== 'half') {
    try {
      await interaction.reply(notices.invalidInput);
    } catch(err) { console.error(err); }
    return;
  }

  const probability = {
    win: (server.settings.gamblePercent / 100),
    loss: (1 - (server.settings.gamblePercent / 100))
  };

  const result = weightedRandom(probability);

  let updates = { points: member.points };

  if (amount === 'all') {

    try {

      if (result === 'win') {
        updates.points += member.points;
        await interaction.reply(`${interaction.member.displayName} won ${points} :moneybag: and now has ${updates.points} ${CURRENCY}! :sparkles:`);
        await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...updates } });
      } else {
        await interaction.reply(notices.lostAll);
        await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { points: 0 } });
      }

    } catch(err) { console.error(err); }
    return;
  }
  
  if (amount === 'half') {

    const halfPoints = Math.round(member.points / 2);

    try {

      if (result === 'win') {
        updates.points += halfPoints;
        await interaction.reply(`${interaction.member.displayName} won ${halfPoints} :moneybag: and now has ${updates.points} ${CURRENCY}!`);
      } else {
        updates.points -= halfPoints;
        await interaction.reply(`${interaction.member.displayName} lost ${halfPoints} :money_with_wings: and now has ${updates.points} ${CURRENCY}.`);
      }

      await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...updates } });
      
    } catch(err) { console.error(err); }
    return;
  }

  const value = parseInt(amount, 10);

  if (value < 1) {
    try {
      await interaction.reply(notices.invalidNegative);
    } catch(err) { console.error(err); }
    return;
  }

  if (value <= member.points) {

    try {

      if (result === 'win') {
        updates.points += value;
        await interaction.reply(`${interaction.member.displayName} won ${value} :moneybag: and now has ${updates.points} ${CURRENCY}!`);
      } else {
        updates.points -= value;
        await interaction.reply(`${interaction.member.displayName} lost ${value} :money_with_wings: and now has ${updates.points} ${CURRENCY}.`);
      }

      await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...updates } });
      
    } catch(err) { console.error(err); }

    return;
  }
  
  try {
    await interaction.reply(notices.notEnough);
  } catch(err) { console.error(err); }
};