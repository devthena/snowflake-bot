const commands = [
  {
    name: '8ball',
    description: 'Play a game of Magic 8 Ball',
    options: [
      {
        name: 'question',
        type: 'STRING',
        description: 'Enter a question',
        required: true
      }
    ]
  },
  {
    name: 'info',
    description: 'Display bot information'
  }
];

module.exports = commands;