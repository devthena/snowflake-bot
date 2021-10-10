const { MessageAttachment } = require('discord.js');

module.exports = async (Bot, member, interaction) => {

  await interaction.deferReply();

  let user = interaction.member;
  let userData = member;

  const mention = interaction.options.getMember('user');

  if(mention) {
    user = mention;
    userData = await Bot.db.collection('members').findOne({ userId: user.id });
  }

  const result = await Bot.db.collection('members').aggregate([
    {
      "$sort": {
        "level": -1,
        "exp": -1
      }
    }, {
      "$group": {
        "_id": false,
        "members": {
          "$push": {
            "_id": "$_id",
            "userId": "$userId",
            "level": "$level",
            "exp": "$exp",
            "points": "$points",
            "stars": "$stars"
          }
        }
      }
    }, {
      "$unwind": {
        "path": "$members",
        "includeArrayIndex": "rank"
      }
    }, {
      "$match": {
        "userId": user.id
      }
    }
  ]);

  console.log(`rank: ${ result }`);

  const profileCard = await getProfileCard(user, userData, rank);
  const attachment = new MessageAttachment(profileCard, 'profile.png');

  try {
    await interaction.editReply({ files: [attachment] });
  } catch(err) { console.error(err); }

};