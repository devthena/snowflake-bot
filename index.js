if (process.version.slice(1).split('.')[0] < 8) {
  throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
}

require('dotenv').config();
const port = process.env.PORT || 8080;
const express = require('express');
const app = new express();
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

const Discord = require('discord.js');

// configure settings for rendering web pages
app.set('view engine', 'ejs');
app.set('views', __dirname + '/www/views');
app.use(express.static(__dirname + '/www/public'));

const Bot = new Discord.Client({ disableEveryone: false });

// load modules for the bot
require('./modules/functions.js')(Bot);
require('./modules/helpers.js')(Bot);

Bot.activeUsers = new Map();
Bot.cooldowns = new Array();
Bot.commands = new Map();
Bot.logger = require('./modules/logger').createLogger('development.log');
Bot.servers = new Map();

require('./www/router')(app, Bot);

const initBot = async () => {

  // load the command files
  const commandFiles = await readdir('./commands/');

  commandFiles.forEach(fn => {
    if (!fn.endsWith(".js")) return;
    Bot.loadCommand(fn);
  });

  // load the bot event files
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