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
    name: 'gamble',
    description: 'Play a game of double or nothing',
    options: [
      {
        name: 'amount',
        type: 'STRING',
        description: 'Enter a specific amount, "all" or "half"',
        required: true
      }
    ]
  },
  {
    name: 'give',
    description: 'Give an amount of points to a user',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'Enter a user from this server',
        required: true
      },
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Enter a specific amount of points',
        required: true
      }
    ]
  },
  {
    name: 'help',
    description: 'Look up command descriptions',
    options: [
      {
        name: 'command',
        type: 'STRING',
        description: 'Name of the command',
        required: false,
        choices: [
          {
            name: '8ball',
            value: '8ball'
          },
          {
            name: 'gamble',
            value: 'gamble'
          },
          {
            name: 'give',
            value: 'give'
          },
          {
            name: 'info',
            value: 'info'
          },
          {
            name: 'leaderboard',
            value: 'leaderboard'
          },
          {
            name: 'optin',
            value: 'optin'
          },
          {
            name: 'optout',
            value: 'optout'
          },
          {
            name: 'points',
            value: 'points'
          },
          {
            name: 'profile',
            value: 'profile'
          },
          {
            name: 'star',
            value: 'star'
          }
        ]
      }
    ]
  },
  {
    name: 'info',
    description: 'Display bot information'
  },
  {
    name: 'leaderboard',
    description: 'Display the top users for this server',
    options: [
      {
        name: 'type',
        type: 'STRING',
        description: 'Enter a leaderboard type',
        required: true,
        choices: [
          {
            name: 'points',
            value: 'points'
          },
          {
            name: 'rank',
            value: 'rank'
          }
        ]
      }
    ]
  },
  {
    name: 'points',
    description: 'Display your points balance'
  },
  {
    name: 'profile',
    description: 'Display your user profile',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'Enter a user from this server',
        required: false
      }
    ]
  },
  {
    name: 'star',
    description: 'Give a star to a user as a form of endorsement',
    options: [
      {
        name: 'user',
        type: 'USER',
        description: 'Enter a user from this server',
        required: true
      }
    ]
  }
];

module.exports = commands;