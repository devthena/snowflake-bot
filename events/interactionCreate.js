const { MessageAttachment } = require('discord.js');

const magic8Ball = require('../commands/8ball');
const gamble = require('../commands/gamble');
const give = require('../commands/give');
const info = require('../commands/info');
const leaderboard = require('../commands/leaderboard');
const star = require('../commands/star');

const { COMMANDS_URL, CURRENCY, CURRENCY_TEXT } = require('../constants/botConfig');
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
  
  if(interaction.isCommand()) {

    if(interaction.commandName === '8ball') {

      if (!isTrue(server.mods.game8Ball)) {
        return await interaction.reply('8Ball is not enabled in this server.');
      }

      const answer = magic8Ball();
      return await interaction.reply(answer);
    }

    if(interaction.commandName === 'gamble') {

      if (!isTrue(server.mods.gameGamble)) {
        return await interaction.reply('Gambling is not enabled in this server.');
      }

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
        return await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to gamble. :neutral_face:`);
      }

      const answer = gamble(memberData, server.settings.gamblePercent, interaction);

      if(answer.updatedMember) {
        server.members.set(interaction.user.id, answer.updatedMember);
        Bot.servers.set(interaction.guildId, server);
      }

      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'give') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
        return await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to give. :neutral_face:`);
      }

      const recipient = interaction.options.getMember('user');
      if(recipient.id === Bot.user.id) {
        return await interaction.reply(`Sorry ${interaction.member.displayName}, I have no use for points. Please keep it! :snowflake:`);
      }

      let recipientData = server.members.get(recipient.id);

      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
      }

      const answer = give(memberData, recipientData, interaction);

      if(answer.updatedMember) {
        server.members.set(interaction.user.id, answer.updatedMember);
        Bot.servers.set(interaction.guildId, server);
      }

      if(answer.updatedRecipient) {
        server.members.set(recipient.id, answer.updatedRecipient);
        Bot.servers.set(interaction.guildId, server);
      }

      return await interaction.reply(answer.message);
    }

    if(interaction.commandName === 'help') {

      const value = interaction.options.getString('command');
      if(!value) return await interaction.reply({ content: `For information on the bot commands, visit this link: ${COMMANDS_URL}`, ephemeral: true });
    }

    if(interaction.commandName === 'info') {

      const answer = info(Bot.user);
      return await interaction.reply({ embeds: [answer.embed] });
    }

    if(interaction.commandName === 'leaderboard') {

      const answer = leaderboard(server.members, interaction);
      return await interaction.reply({ embeds: [answer.embed] });
    }

    if(interaction.commandName === 'points') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
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
        server.members.set(member.id, memberData);
        Bot.servers.set(interaction.guildId, server);
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
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
      }

      if(memberData.level < 2) return await interaction.reply('You need to be at least level 2 to use this command.');

      const recipient = interaction.options.getMember('user');

      let recipientData = server.members.get(recipient.id);

      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        server.members.set(interaction.user.id, memberData);
        Bot.servers.set(interaction.guildId, server);
      }

      const answer = star(memberData, recipientData, interaction);

      if(answer.updatedMember) {
        server.members.set(interaction.user.id, answer.updatedMember);
        Bot.servers.set(interaction.guildId, server);
      }

      if(answer.updatedRecipient) {
        server.members.set(recipient.id, answer.updatedRecipient);
        Bot.servers.set(interaction.guildId, server);
      }

      return await interaction.reply({ embeds: [answer.embed] });
    }

  }
};
