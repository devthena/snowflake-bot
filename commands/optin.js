module.exports = (validOptins, interaction) => {

  const validRoles = validOptins.split(',');
  const role = interaction.options.getRole('role');

  const isRoleAllowed = validRoles.includes(role.name);

  if (isRoleAllowed) {

    if (interaction.member.roles.cache.has(role.id)) {
      return { message: `${interaction.member.displayName}, you're already opted in, goob. :wink:` };
    }

    interaction.member.roles.add(role)
      .then(function () {
        return { message: `Success! You now have the ${role.name} role, ${interaction.member.displayName}!` };
      }).catch(function (error) {
        return { message: 'There was a problem adding this role. Please try again later.' };
      });
  }
  
  return { message: 'Nice try -- how about a different role? :smirk:' };
};