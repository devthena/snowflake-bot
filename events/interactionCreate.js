const clear = require('../commands/clear');
const gamble = require('../commands/gamble');
const give = require('../commands/give');
const help = require('../commands/help');
const info = require('../commands/info');
const leaderboard = require('../commands/leaderboard');
const magic8Ball = require('../commands/8ball');
const nickname = require('../commands/nickname');
const optin = require('../commands/optin');
const profile = require('../commands/profile');
const star = require('../commands/star');
const take = require('../commands/take');

const { CURRENCY } = require('../constants/botConfig');
const memberConfig = require('../constants/memberConfig');

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
    if(interaction.commandName === 'profile') return profile(Bot, interaction);

    // interactions that use member data

    let member = await Bot.db.collection('members').findOne({ userId: interaction.user.id });
    if(!member) {
      member = {
        userId: interaction.user.id,
        serverId: interaction.guildId,
        ...memberConfig
      };
      await Bot.db.collection('members').insertOne(member);
    }

    if(interaction.commandName === 'gamble') return gamble(Bot, member, server, interaction);
    if(interaction.commandName === 'give') return give(Bot, member, interaction);
    if(interaction.commandName === 'star') return star(Bot, member, interaction);
    if(interaction.commandName === 'take') return take(Bot, interaction);
    if(interaction.commandName === 'points') {
      try {
        const message = `${interaction.member.displayName}, your current balance is: ${member.points} ${CURRENCY}`;
        await interaction.reply(message);
      } catch(err) { console.error(err); }
      return;
    }

  }
};
