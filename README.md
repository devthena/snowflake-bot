## Snowflake Bot
A Discord bot I created for AthenaUS and AikoBliss servers. This bot is not meant to be for public use but you are more than welcome to clone or fork this repository.

### Setup Bot Application
Here is a link to a guide in setting up a Discord bot application: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot. From this guide you should be able to get a Client ID, Client Secret, and Token

### Environment Variables
The following are required in your .env file to properly run the bot:
* AUTH_REDIRECT_URI - sample value http://snowflakebot.com/auth/discord/callback
* AUTH_REDIRECT_URI_LOCAL (optional) - sample value http://localhost:8080/auth/discord/callback
* CLIENT_ID
* CLIENT_SECRET
* TOKEN

### Database Setup
The code is currently looking for a `master.db` file and it uses SQLite3 for manipulating the database. The structure for the tables are tailored to what we need for the Discord servers.

#### Here is the `guilds` table structure:
* server_id PRIMARY UNIQUE
* owner_id
* mod_alert_optin
* mod_alert_stream
* mod_auto_add
* mod_game_8ball
* mod_game_gamble
* mod_highlight_board
* mod_optins
* role_auto_add
* role_moderator
* role_optins
* channel_alert_optin
* channel_alert_stream
* channel_highlight_board
* message_alert_stream

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
* !clear <number> - delete <number> amount of messages not older than two weeks (admin only)
* !commands - display the URL for the commands list
* !gamble <number> - a game with 50/50 chance to double <number> user points or lose it
* !give <@mention> <number> - transfer <number> user points to another user
* !leaderboard - display the top 5 users with the highest user points
* !optin <role> - adds a role to the user, useful for notifications for movie nights
* !optout <role> - removes a role from the user
* !points - display the current user points a user has
* !snowflake - display the bot information
* !take <@mention> <number> - take <number> user points from a user (admin only)

### References
* Guide in developing a Discord Bot using Discord.js - https://discordjs.guide
* Discord.js documentation - https://discord.js.org/#/docs/main/stable/general/welcome

### Contributing
This is a little project I did for fun and I will keep updating it when I have more time. At the moment I am not accepting pull requests. Please consider forking the repository if you want to play with the code and test fixes or features.
