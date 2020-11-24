## Snowflake Bot
A Discord bot I created for AthenaUS and AikoBliss servers. This bot is not meant for public use but you are more than welcome to fork this repository.

### Setup Bot Application
Here is a link to a guide in setting up a Discord bot application: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot. From this guide you should be able to get a Client ID, Client Secret, and Token

### Environment Variables
The following are required in your `.env` file to properly run the bot:
* AUTH_REDIRECT_URI - sample value http://snowflakebot.com/auth/discord/callback
* AUTH_REDIRECT_URI_LOCAL (optional) - sample value http://localhost:8080/auth/discord/callback
* CLIENT_ID
* CLIENT_SECRET
* TOKEN

### Development and Testing
In your terminal, run the following commands:
```sh
$ nvm use
$ npm install
$ npm run start
```
The web application tied to this still needs a lot of refactoring but the Discord bot client should be good to go.

### Default Commands
* !8ball - a mini game patterned from Magic 8 Ball
* !clear {number} - delete {number} amount of messages not older than two weeks (admin only)
* !commands - display the URL for the commands list
* !gamble {number} - a game with 50/50 chance to double {number} user points or lose it
* !give {@user} {number} - transfer {number} user points to another user
* !optin {role} - adds a role to the user, useful for notifications for movie nights
* !optout {role} - removes a role from the user
* !points - display the current user points a user has
* !snowflake - display the bot information
* !take {@user} {number} - take {number} user points from a user (admin only)
* !topcoin - display a list of users with the highest points
* !toprank - display a list of users with the highest level

### References
* Guide in developing a Discord Bot using Discord.js - https://discordjs.guide
* Discord.js documentation - https://discord.js.org/#/docs/main/stable/general/welcome

### Contributing
This is a little project I did for fun and I will keep updating it when I have time. At the moment I am not accepting pull requests. Please consider forking the repository if you want to play with the code.
