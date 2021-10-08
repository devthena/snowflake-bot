const asyncForEach = require('../helpers/asyncForEach');

module.exports = async interaction => {

  const format = interaction.options.getString('format');
  const role = interaction.options.getRole('role');

  const filteredMembers = interaction.guild.members.cache.filter(member => member.roles.cache.find(memberRole => memberRole.id === role.id));

  if (filteredMembers.size > 0) {

    let updatedCount = 0;

    await asyncForEach(filteredMembers, async member => {
      if(member.manageable) {
        const nickname = format.replace('name', member.user.username);
        try {
          await member.setNickname(nickname);
          updatedCount++;
        } catch(err) {
          console.error(err);
        }
      }
    });

    try {
      await interaction.reply(`Total members found: ${filteredMembers.size}. Total members updated: ${updatedCount}`);
    } catch(err) { console.error(err); }

  } else {
    try {
      await interaction.reply('Total members found: 0');
    } catch(err) { console.error(err); }
  }

};