
const { MessageEmbed } = require('discord.js');
const { YELLOW } = require('../constants/discordColors');
const expAddends = require('../constants/expAddends');
const updateLevel = require('../helpers/user/updateLevel');

module.exports = (memberData, recipientData, interaction) => {

  const notices = {
    invalidMax: `${interaction.member.displayName}, you can only give one star per day.`,
    invalidSelf: `${interaction.member.displayName}, you can't give yourself a star, goob.`
  };

  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  const recipient = interaction.options.getMember('user');

  if (interaction.member.id === recipient.id) return { message: notices.invalidSelf };
  if (memberData.lastStar === today) return { message: notices.invalidMax };

  memberData.lastStar = today;

  recipientData.stars += 1;
  recipientData.exp += expAddends.starred;

  const updatedRecipient = updateLevel(recipientData, recipient.displayName, interaction.guild.channels);

  const botEmbed = new MessageEmbed()
    .setTitle('Daily Star Sent!')
    .setDescription(`${recipient.displayName} got a star from ${interaction.member.displayName}!\n\nThey also got +100 EXP as a bonus. :sparkles:`)
    .setColor(YELLOW)
    .setFooter(`Star given on ${now}`);

  return {
    embed: botEmbed,
    updatedMember: memberData,
    updatedRecipient: updatedRecipient
  };

};