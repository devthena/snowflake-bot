module.exports = (toAdd, validOptins, interaction) => {

  const validRoles = validOptins.split(',');
  const role = interaction.options.getRole('role');

  const isRoleAllowed = validRoles.includes(role.name);

  if (isRoleAllowed) {

    if (interaction.member.roles.cache.has(role.id)) {
      
      if(toAdd) return { message: `${interaction.member.displayName}, you're already opted in, goob. :wink:` };
      
      interaction.member.roles.remove(role)
        .then(function () {
          return { message: `You are now free from the ${role.name} role, ${interaction.member.displayName}!` };
        }).catch(function (error) {
          return { message: 'There was a problem removing this role. Please try again later.' };
        });
    }

    if(!toAdd) return { message: `${interaction.member.displayName}, you don't have that role, goob. :wink:` };

    interaction.member.roles.add(role)
      .then(function () {
        return { message: `Success! You now have the ${role.name} role, ${interaction.member.displayName}!` };
      }).catch(function (error) {
        return { message: 'There was a problem adding this role. Please try again later.' };
      });
  }
  
  if(toAdd) return { message: 'Nice try -- how about a different role? :smirk:' };
  return { message: `Nope, can't remove that -- how about a different role? :thinking:` };
};