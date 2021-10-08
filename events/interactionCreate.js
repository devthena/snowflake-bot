const { MessageAttachment } = require('discord.js');

const clear = require('../commands/clear');
const gamble = require('../commands/gamble');
const give = require('../commands/give');
const help = require('../commands/help');
const info = require('../commands/info');
const leaderboard = require('../commands/leaderboard');
const magic8Ball = require('../commands/8ball');
const nickname = require('../commands/nickname');
const optin = require('../commands/optin');
const star = require('../commands/star');
const take = require('../commands/take');

const { CURRENCY } = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

const getProfileCard = require('../helpers/user/getProfileCard');
const getRank = require('../helpers/user/getRank');

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

    if(interaction.commandName === '8ball') return magic8Ball(interaction);
    if(interaction.commandName === 'clear') return clear(interaction);
    if(interaction.commandName === 'help') return help(interaction);
    if(interaction.commandName === 'info') return info(Bot, interaction);
    if(interaction.commandName === 'leaderboard') return leaderboard(Bot, interaction);
    if(interaction.commandName === 'nickname') return nickname(interaction);
    if(interaction.commandName === 'optin' || interaction.commandName === 'optout') {
      return optin(interaction.commandName === 'optin', server, interaction);
    }
    if(interaction.commandName === 'points') {
      try {
        const message = `${interaction.member.displayName}, your current balance is: ${member.points} ${CURRENCY}`;
        await interaction.reply(message);
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
      return gamble(member, server.settings.gamblePercent, interaction);
    }
    if(interaction.commandName === 'give') return give(Bot, member, interaction);

    // TODO: replace getRank function with mongodb query

    if(interaction.commandName === 'profile') {

      let user = interaction.member;
      const mention = interaction.options.getMember('user');

      if(mention) user = mention;

      try {

        const rank = getRank(member.id, server.members);
        const profileCard = await getProfileCard(memberData, rank, member);
        const attachment = new MessageAttachment(profileCard, 'profile.png');

        await interaction.editReply({ files: [attachment] });
      
      } catch(err) { console.error(err); }
  
      return;
    }

    // TODO: add new field lastStar to the entry

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

    if(interaction.commandName === 'take') return take(Bot, interaction);

  }
};
