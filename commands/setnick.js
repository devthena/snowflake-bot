/**
 * Sets the nickname of users with specific roles using a certain format
 * @param {Client} Bot 
 * @param {Message} message 
 * @param {Array} args 
 */
exports.run = async (Bot, message, args) => {

  if (!message.guild.available) return;

  const validTypes = ['subs', 'nitro', 't2t3'];
  if (!args.length) return message.channel.send('Missing arguments. Usage: !setnick <type> <format> Example: !setnick subs 🎁 name 🎁');
  if (!validTypes.includes(args[0])) return message.channel.send('Invalid type. Please use: subs | nitro | t2t3');
  if (!args[1]) return message.channel.send('No format provided. Example usage: !setnick subs 🎁 name 🎁');

  let type = args.shift();
  let format = args.join(' ');
  let updatedCount = 0;

  let filteredMembers = message.guild.members.cache.filter(member => {

    const hasSubscriberRole = member.roles.cache.find(role => role.name.toLowerCase().includes('subscriber'));
    const hasNitroBoosterRole = member.premiumSince;
    const hasT2T3Role = member.roles.cache.find(role => role.name.toLowerCase().includes('tier 2') || role.name.toLowerCase().includes('tier 3'));

    switch (type) {
      case 'subs':
        return hasSubscriberRole && !hasNitroBoosterRole && !hasT2T3Role;
      case 'nitro':
        return hasNitroBoosterRole && !hasT2T3Role;
      case 't2t3':
        return hasT2T3Role;
    }
  });

  if (filteredMembers) {
    let processedCount = 0;
    filteredMembers.forEach(member => {
      let nickname = format.replace('name', member.user.username);
      member.setNickname(nickname)
        .then(() => {
          processedCount++;
          updatedCount++;
          if (processedCount === filteredMembers.size) {
            message.channel.send(`Total ${type} found: ${filteredMembers.size}. Total ${type} updated: ${updatedCount}`);
          }
        })
        .catch(error => {
          processedCount++;
          Bot.logger.error(error);
          if (processedCount === filteredMembers.size) {
            message.channel.send(`Total ${type} found: ${filteredMembers.size}. Total ${type} updated: ${updatedCount}`);
          }
        });
    });
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  cooldown: 5,
  permitLevel: 11
};

exports.info = {
  name: 'setnick',
  description: 'Sets the nickname of users with specific roles using a certain format',
  category: 'admin',
  usage: '!setnick <type> <format>'
};
