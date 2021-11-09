const asyncForEach = require('../helpers/asyncForEach');

module.exports = async interaction => {

  const format = interaction.options.getString('format');
  const role = interaction.options.getRole('role');
  const channel = interaction.channel;

  const filteredMembers = interaction.guild.members.cache.filter(member => member.roles.cache.find(memberRole => memberRole.id === role.id));
  const filtered = Array.from(filteredMembers.values());

  if (filtered.length > 0) {

    try {
      await interaction.reply(`Found: **${filtered.length}** | Processing...`);
    } catch(err) { console.error(err); }

    let processedCount = 0;
    let progress = 0;
    let updatedCount = 0;

    await asyncForEach(filtered, async member => {

      if(member.manageable) {
        const name = member.user.username.length > 28 ? member.user.username.slice(0,29) : member.user.username;
        const nickname = format.replace('name', name);
        try {
          await member.setNickname(nickname);
          updatedCount += 1;
        } catch(err) {
          console.error(err);
        }
      }

      processedCount += 1;
      const percent = Math.floor((processedCount / filtered.length) * 100);

      if(percent === 100) {

        let finalMessage = `Total Updated: **${ updatedCount }** | Processed: **100%** :white_check_mark:`;
        if(processedCount !== updatedCount) finalMessage += `\n_(some members were not updated due to role hierarchy)_`;
        await channel.send(finalMessage);

      } else if (percent >= 75 && progress !== 75) {

        progress = 75;
        await channel.send(`Updated: **${ updatedCount }** | Processed: **75%**`);

      } else if (percent >= 50 && percent < 75 && progress !== 50) {

        progress = 50;
        await channel.send(`Updated: **${ updatedCount }** | Processed: **50%**`);

      } else if(percent >= 25 && percent < 50 && progress !== 25) {

        progress = 25;
        await channel.send(`Updated: **${ updatedCount }** | Processed: **25%**`);
      }

    });

  } else {
    try {
      await interaction.reply('Total members found: 0');
    } catch(err) { console.error(err); }
  }

};