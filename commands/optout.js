module.exports = (interaction) => {

  const role = interaction.options.getRole('role');

  if (!interaction.member.roles.cache.has(role.id)) {
    return { message: `${interaction.member.displayName}, you don't have that role, goob. :wink:` };
  }

  interaction.member.roles.remove(role)
    .then(function () {
      return { message: `You are now free from the ${role.name} role, ${interaction.member.displayName}!` };
    }).catch(function (error) {
      return { message: 'There was a problem removing this role. Please try again later.' };
    });
};