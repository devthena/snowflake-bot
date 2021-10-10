const { MessageAttachment } = require('discord.js');
const getProfileCard = require('../helpers/user/getProfileCard');

module.exports = async (Bot, interaction) => {

  await interaction.deferReply();

  let user = interaction.member;

  const mention = interaction.options.getMember('user');
  if(mention) user = mention;

  const filtered = await Bot.db.collection('members')
    .find({
      serverId: interaction.guildId,
      "$or": [{ "level": { "$gt": 1 } }, { "exp": { "$gt": 0 } }]
    })
    .sort({ level: -1, exp: -1 })
    .toArray();

  let rank = null;
  let userData = filtered.find(data => data.userId === user.id);

  if(!userData) userData = await Bot.db.collection('members')
    .findOne({ userId: user.id, serverId: interaction.guildId });
  else rank = filtered.findIndex(data => data.userId === user.id) + 1;

  const profileCard = await getProfileCard(user, userData, rank);
  const attachment = new MessageAttachment(profileCard, 'profile.png');

  try {
    await interaction.editReply({ files: [attachment] });
  } catch(err) { console.error(err); }

};