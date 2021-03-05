## Snowflake Bot

A Discord bot I created for AthenaUS and AikoBliss servers. This bot is not meant for public use but you are more than welcome to fork this repository.

### Setup Bot Application

Here is a link to a guide in setting up a Discord bot application: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot. From this guide you should be able to get a Client ID, Client Secret, and Token

### Environment Variables

The following are required in your `.env` file to properly run the bot:

- AUTH_REDIRECT_URI - sample value http://snowflakebot.com/auth/discord/callback
- AUTH_REDIRECT_URI_LOCAL (optional) - sample value http://localhost:8080/auth/discord/callback
- CLIENT_ID
- CLIENT_SECRET
- TOKEN

### Development and Testing

In your terminal, run the following commands:

```sh
$ nvm use
$ npm install
$ npm run start
```

### Default Commands

- !8ball - a mini game patterned from Magic 8 Ball
- !commands - displays the URL for the commands list
- !gamble {number} - a game with 50/50 chance to double {number} user points or lose it
- !give {@user} {number} - transfers {number} user points to another user
- !optin {role} - adds a role to the user, useful for notifications for movie nights
- !optout {role} - removes a role from the user
- !points - displays the current user points a user has
- !snowflake - displays the bot information
- !star {@user} - gives a star (as an endorsement) to a user
- !topcoin - displays a list of users with the highest points
- !toprank - displays a list of users with the highest level

### References

- Guide in developing a Discord Bot using Discord.js - https://discordjs.guide
- Discord.js documentation - https://discord.js.org/#/docs/main/stable/general/welcome
