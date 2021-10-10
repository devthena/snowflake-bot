module.exports = async interaction => {

  let responseArray = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'For sure.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    'Don\'t count on it.',
    'My reply is no.',
    'No.',
    'Outlook not so good',
    'Very doubtful.'
  ];

  const randomNum = Math.floor(Math.random() * responseArray.length);
  const answer = responseArray[randomNum];

  try {
    await interaction.reply(`:8ball: says.. ${ answer }`);
  } catch(err) { console.error(err); }
  
};