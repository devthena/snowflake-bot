module.exports = async interaction => {

  const amount = interaction.options.getInteger('amount');
  if(amount < 1) return { message: 'It has to be at least 1 message, goob. :wink:' };
  if(amount > 100) return { message: 'You can only delete 100 messages at a time.' };

  const messages = await interaction.channel.bulkDelete(amount, true);

  try {
    await interaction.reply({
      content: `Cleared a total of ${ messages.size } messages.`,
      ephemeral: true
    });
  } catch(err) { console.error(err); }
  
};