const commands = [
  {
    name: 'clear',
    description: 'Delete a specific amount of messages',
    defaultPermission: false,
    options: [
      {
        name: 'amount',
        type: 'INTEGER',
        description: 'Enter the number of messages',
        required: true
      }
    ]
  },
  {
    name: 'gamble',
    description: 'Play your points for a chance to double it',
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
    description: 'Display helpful links about the bot'
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
    name: 'nickname',
    description: 'Set nicknames of members that have the specified role',
    defaultPermission: false,
    options: [
      {
        name: 'role',
        type: 'ROLE',
        description: 'Enter a role',
        required: true
      },
      {
        name: 'format',
        type: 'STRING',
        description: 'Example: 🎁 name 🎁',
        required: true
      }
    ]
  },
  {
    name: 'optin',
    description: 'Add a role to yourself',
    options: [
      {
        name: 'role',
        type: 'ROLE',
        description: 'Enter a role',
        required: true
      }
    ]
  },
  {
    name: 'optout',
    description: 'Remove a role from yourself',
    options: [
      {
        name: 'role',
        type: 'ROLE',
        description: 'Enter a role',
        required: true
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
  },
  {
    name: 'take',
    description: 'Take an amount of points from a user',
    defaultPermission: false,
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
];

module.exports = commands;