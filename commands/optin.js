const isTrue = require('../helpers/isTrue');

module.exports = async (toAdd, server, interaction) => {

  if (!isTrue(server.mods.optins)) {
    try {
      await interaction.reply('Role opt in is not enabled in this server.');
    } catch(err) { console.error(err); }
    return;
  }

  const validRoles = server.roles.optins.split(',');
  const role = interaction.options.getRole('role');

  const isRoleAllowed = validRoles.includes(role.name);

  if (isRoleAllowed) {

    if (interaction.member.roles.cache.has(role.id)) {
      
      if(toAdd) return await interaction.reply(`${interaction.member.displayName}, you're already opted in, goob. :wink:`);

      if(interaction.member.manageable) {
        try {
          await interaction.member.roles.remove(role);
          return await interaction.reply(`You are now free from the ${role.name} role, ${interaction.member.displayName}!`);
        } catch(err) { console.error(err); }
      }

    }

    if(!toAdd) return await interaction.reply(`${interaction.member.displayName}, you don't have that role, goob. :wink:`);

    if(interaction.member.manageable) {
      try {
        await interaction.member.roles.add(role);
        return await interaction.reply(`Success! You now have the ${role.name} role, ${interaction.member.displayName}!`);
      } catch(err) { console.error(err); }
    }
    
  }
  
  try {

    let message = `Nope, can't remove that -- how about a different role? :thinking:`;
    if(toAdd) message = 'Nice try -- how about a different role? :smirk:';
    await interaction.reply(message);

  } catch(err) { console.error(err); }
  
};