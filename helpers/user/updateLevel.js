const botConfig = require('../../constants/botConfig');

const updateLevel = member => {

  let updatedMember = JSON.parse(JSON.stringify(member));
  const totalExp = member.level * botConfig.LVL_MULTIPLIER;

  if (member.exp >= totalExp) {
    updatedMember.level = member.level + 1;
    updatedMember.exp = member.exp - totalExp;
  }

  return updatedMember;
};

module.exports = updateLevel;