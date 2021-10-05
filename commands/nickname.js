module.exports = interaction => {

  const format = interaction.options.getString('format');
  const role = interaction.options.getRole('role');

  const filteredMembers = interaction.guild.members.cache.filter(member => member.roles.cache.find(memberRole => memberRole.id === role.id));

  if (filteredMembers.size > 0) {

    let processedCount = 0;
    let updatedCount = 0;

    filteredMembers.forEach(member => {

      const nickname = format.replace('name', member.user.username);

      if(member.managable) {
        member.setNickname(nickname)
        .then(() => {
          processedCount++;
          updatedCount++;
          if (processedCount === filteredMembers.size) {
            return { message: `Total members found: ${filteredMembers.size}. Total members updated: ${updatedCount}` };
          }
        })
        .catch(error => {
          processedCount++;
          if (processedCount === filteredMembers.size) {
            return { message: `Total members found: ${filteredMembers.size}. Total members updated: ${updatedCount}` };
          }
        });
      }
    });
  }

  return { message: 'Total members found: 0' };
};