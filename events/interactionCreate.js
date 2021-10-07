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
const take = require('../commands/take');

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
  
  if(interaction.isCommand()) {

    // interactions that do not use member data

    if(interaction.commandName === '8ball') {

      const response = magic8Ball();

      try {
        await interaction.reply(response);
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'clear') {

      const response = await clear(interaction);

      try {
        await interaction.reply({ content: response.message, ephemeral: true});
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'help') {

      const row = new MessageActionRow()
        .addComponents(new MessageButton().setLabel('Commands').setStyle('LINK').setURL(URLS.COMMANDS))
        .addComponents(new MessageButton().setLabel('FAQ').setStyle('LINK').setURL(URLS.FAQ));

      try {
        await interaction.reply({ content: 'Here are some links you might be interested in:', components: [row] });
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'info') {

      const response = info(Bot.user);

      try {
        await interaction.reply({ embeds: [response.embed] });
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'nickname') {

      const response = nickname(interaction);

      try {
        await interaction.reply(response.message);
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'optin') {

      if (!isTrue(server.mods.optins)) {

        try {
          await interaction.reply('Role opt in is not enabled in this server.');
        } catch(err) { console.error(err); }
  
        return;
      }

      const response = await optin(true, server.roles.optins, interaction);

      try {
        await interaction.reply(response.message);
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'optout') {

      if (!isTrue(server.mods.optins)) {

        try {
          await interaction.reply('Role opt out is not enabled in this server.');
        } catch(err) { console.error(err); }
  
        return;
      }

      const response = await optin(false, server.roles.optins, interaction);

      try {
        await interaction.reply(response.message);
      } catch(err) { console.error(err); }

      return;
    }

    // interactions that use member data

    await interaction.deferReply();

    let member = await Bot.db.collection('members').findOne({ userId: interaction.user.id });
    if(!member) {
      member = {
        userId: interaction.user.id,
        serverId: interaction.guildId,
        ...memberConfig
      };
      await Bot.db.collection('members').insertOne(member);
    }

    if(interaction.commandName === 'gamble') {

      if (!isTrue(server.mods.gameGamble)) {

        try {
          await interaction.reply('Gambling is not enabled in this server.');
        } catch(err) { console.error(err); }
  
        return;
      }

      if (member.points === 0) {

        try {
          await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to gamble. :neutral_face:`);
        } catch(err) { console.error(err); }
  
        return;
      }

      const response = gamble(member, server.settings.gamblePercent, interaction);

      try {
        await interaction.reply(response.message);
        await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...response.updates } });
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'give') {

      if (member.points === 0) {

        try {
          await interaction.reply(`Sorry ${interaction.member.displayName}, you have no ${CURRENCY_TEXT} to give. :neutral_face:`);
        } catch(err) { console.error(err); }
  
        return;
      }

      const recipient = interaction.options.getMember('user');
      if(recipient.id === Bot.user.id) {

        try {
          await interaction.reply(`Sorry ${interaction.member.displayName}, I have no use for points. Please keep it! :snowflake:`);
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

      const response = give(member, recipientData, interaction);

      try {
        await interaction.reply(response.message);
        await Bot.db.collection('members').updateOne({ userId: interaction.user.id }, { $set: { ...response.updates } });
        await Bot.db.collection('members').updateOne({ userId: recipient.id }, { $set: { ...response.recipientUpdates } });
      } catch(err) { console.error(err); }

      return;
    }

    // TODO: continue updates from this command
    
    if(interaction.commandName === 'leaderboard') {

      const answer = leaderboard(server.members, interaction);

      try {
        await interaction.reply({ embeds: [answer.embed] });
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'points') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);

        try {
          await interaction.reply(`${interaction.member.displayName}, you do not have any ${CURRENCY_TEXT} yet. :neutral_face:`);
        } catch(err) { console.error(err); }
  
        return;
      }

      try {
        await interaction.reply(`${interaction.member.displayName}, your current balance is: ${memberData.points} ${CURRENCY}`);
      } catch(err) { console.error(err); }

      return;
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

      try {

        await interaction.deferReply();

        const rank = getRank(member.id, server.members);
        const profileCard = await getProfileCard(memberData, rank, member);
        const attachment = new MessageAttachment(profileCard, 'profile.png');

        await interaction.editReply({ files: [attachment] });
      
      } catch(err) { console.error(err); }
  
      return;
    }

    if(interaction.commandName === 'star') {

      let memberData = server.members.get(interaction.user.id);
      if (!memberData) {
        memberData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(interaction.user.id, memberData);
      }

      if(memberData.level < 2) {
        
        try {
          await interaction.reply('You need to be at least level 2 to use this command.');
        } catch(err) { console.error(err); }
  
        return;
      }

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

      try {
        await interaction.reply(answer.message);
      } catch(err) { console.error(err); }

      return;
    }

    if(interaction.commandName === 'take') {

      const recipient = interaction.options.getMember('user');
      if(recipient.id === Bot.user.id) {

        try {
          await interaction.reply(`Sorry ${interaction.member.displayName}, you can't take points from me. :snowflake:`);
        } catch(err) { console.error(err); }
  
        return;
      }

      let recipientData = server.members.get(recipient.id);
      if (!recipientData) {
        recipientData = JSON.parse(JSON.stringify(memberConfig));
        updateMemberData(recipient.id, recipientData);
      }

      const answer = take(recipientData, interaction);
      if(answer.updatedRecipient) updateMemberData(recipient.id, answer.updatedRecipient);

      try {
        await interaction.reply(answer.message);
      } catch(err) { console.error(err); }

      return;
    }

  }
};
