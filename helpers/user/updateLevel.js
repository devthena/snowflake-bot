const botConfig = require('../../constants/botConfig');

let state = {
  lastMessage: ''
};

const updateLevel = (member, displayName, guildChannels) => {

  let updatedMember = JSON.parse(JSON.stringify(member));
  const totalExp = member.level * botConfig.LVL_MULTIPLIER;

  if (member.exp >= totalExp) {
    updatedMember.level = member.level + 1;
    updatedMember.exp = member.exp - totalExp;
    const botChannel = guildChannels.find(channel => channel.name.includes(botConfig.CHANNEL));
    if (botChannel) {
      const message = `${displayName} has advanced to level ${updatedMember.level}! :gem:`;
      if (state.lastMessage != message) {
        botChannel.send(message);
        state.lastMessage = message;
      }
    }
  }

  return updatedMember;
};

module.exports = updateLevel;