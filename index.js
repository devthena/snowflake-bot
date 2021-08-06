if (process.version.slice(1).split('.')[0] < 16) {
  throw new Error('Node 16.0.0 or higher is required. Update Node on your system.');
}

require('dotenv').config();
const port = process.env.PORT || 8080;
const express = require('express');
const app = new express();
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

const { Client, Intents } = require('discord.js');

app.set('view engine', 'pug');
app.set('views', __dirname + '/web/views');
app.use(express.static(__dirname + '/web/public'));

const Bot = new Client({
  disableEveryone: false,
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});

Bot.logger = require('./helpers/logger').createLogger('snowflake.log');
Bot.servers = new Map();

require('./web/router')(app, Bot);

const initBot = async () => {

  const eventFiles = await readdir('./events/');

  eventFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    Bot.logger.info(`[SYS] Loading event: ${eventName}`);
    Bot.on(eventName, event.bind(null, Bot));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  Bot.login(process.env.TOKEN);
};

app.listen(port);
initBot();