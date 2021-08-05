const { MessageActionRow, MessageAttachment, MessageButton } = require('discord.js');

const clear = require('../commands/clear');
const gamble = require('../commands/gamble');
const give = require('../commands/give');
const info = require('../commands/info');
const leaderboard = require('../commands/leaderboard');
const magic8Ball = require('../commands/8ball');
const nickname = require('../commands/nickname');
const optin = require('../commands/optin');
const star = require('../commands/star');

const { CURRENCY, CURRENCY_TEXT, URLS } = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

const getProfileCard = require('../helpers/user/getProfileCard');
const getRank = require('../helpers/user/getRank');
const isTrue = require('../helpers/isTrue');

/**
 * Handles interactions from users
 * @listens event:interactionCreate
 * @param {Client} Bot 
 * @param {Interaction} interaction 
 */
module.exports = async (Bot, interaction) => {

  const server = Bot.servers.get(interaction.guildId);

  const updateMemberData = (id, data) => {
    server.members.set(id, data);
    Bot.servers.set(interaction.guildId, server);
  };
  
  if(interaction.isCommand()) {

    if(interaction.commandName === '8ball') {

      if (!isTrue(server.mods.game8Ball)) {
        return await interaction.reply('8Ball is not enabled in this server.');
      }

      const answer = magic8Ball();
      return await interaction.reply(answer);
    }

    if(interaction.commandName === 'clear') {

      const answer = await clear(interaction);
      return await interaction.reply({ content: answer.message, ephemeral: true});
    }

    if(interaction.commandName === 'gamble') {

      if (!isTrue(server.mods.gameGamble)) {
        return await interaction.reply('Gambling is not enabled in this server.');
      }

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);
        return await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to gamble. :neutral_face:`);
      }

      const answer = gamble(memberData, server.settings.gamblePercent, interaction);
      if(answer.updatedMember) updateMemberData(interaction.user.id, answer.updatedMember);
      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'give') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);
        return await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to give. :neutral_face:`);
      }

      const recipient = interaction.options.getMember('user');
      if(recipient.id === Bot.user.id) {
        return await interaction.reply(`Sorry ${interaction.member.displayName}, I have no use for points. Please keep it! :snowflake:`);
      }

      let recipientData = server.members.get(recipient.id);
      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(recipient.id, recipientData);
      }

      const answer = give(memberData, recipientData, interaction);
      if(answer.updatedMember) updateMemberData(interaction.user.id, answer.updatedMember);
      if(answer.updatedRecipient) updateMemberData(recipient.id, answer.updatedRecipient);

      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'help') {

      const row = new MessageActionRow()
        .addComponents(new MessageButton().setLabel('Commands').setStyle('LINK').setURL(URLS.COMMANDS))
        .addComponents(new MessageButton().setLabel('FAQ').setStyle('LINK').setURL(URLS.FAQ));

      return await interaction.reply({ content: 'Here are some links you might be interested in:', components: [row] });
    }

    if(interaction.commandName === 'info') {

      const answer = info(Bot.user);
      return await interaction.reply({ embeds: [answer.embed] });
    }

    if(interaction.commandName === 'leaderboard') {

      const answer = leaderboard(server.members, interaction);
      return await interaction.reply({ embeds: [answer.embed] });
    }

    if(interaction.commandName === 'nickname') {

      const answer = nickname(interaction);
      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'optin') {

      if (!isTrue(server.mods.optins)) {
        return await interaction.reply('Role opt in is not enabled in this server.');
      }

      const answer = optin(true, server.roles.optins, interaction);
      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'optout') {

      if (!isTrue(server.mods.optins)) {
        return await interaction.reply('Role opt out is not enabled in this server.');
      }

      const answer = optin(false, server.roles.optins, interaction);
      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'points') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);
        return await interaction.reply(`${interaction.member.displayName}, you do not have any ${CURRENCY_TEXT} yet. :neutral_face:`);
      }

      return await interaction.reply(`${interaction.member.displayName}, your current balance is: ${memberData.points} ${CURRENCY}`);
    }

    if(interaction.commandName === 'profile') {

      let member = interaction.member;
      const mention = interaction.options.getMember('user');

      if(mention) member = mention;

      let memberData = server.members.get(member.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(member.id, memberData);
      }

      const rank = getRank(member.id, server.members);
      const profileCard = await getProfileCard(memberData, rank, member);
      const attachment = new MessageAttachment(profileCard, 'profile.png');

      return await interaction.reply({ attachments: [attachment] });
    }

    if(interaction.commandName === 'star') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);
      }

      if(memberData.level < 2) return await interaction.reply('You need to be at least level 2 to use this command.');

      const recipient = interaction.options.getMember('user');

      let recipientData = server.members.get(recipient.id);
      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(recipient.id, recipientData);
      }

      const answer = star(memberData, recipientData, interaction);
      if(answer.updatedMember) updateMemberData(interaction.user.id, answer.updatedMember);
      if(answer.updatedRecipient) updateMemberData(recipient.id, answer.updatedRecipient);
      if(answer.embed) return await interaction.reply({ embeds: [answer.embed] });

      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'take') {

      const recipient = interaction.options.getMember('user');
      if(recipient.id === Bot.user.id) {
        return await interaction.reply(`Sorry ${interaction.member.displayName}, you can't take points from me. :snowflake:`);
      }

      let recipientData = server.members.get(recipient.id);
      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(recipient.id, recipientData);
      }

      const answer = take(recipientData, interaction);
      if(answer.updatedRecipient) updateMemberData(recipient.id, answer.updatedRecipient);
      return await interaction.reply(answer.message);
    }

  }
};
