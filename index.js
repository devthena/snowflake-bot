if (process.version.slice(1).split('.')[0] < 12) {
  throw new Error('Node 12.0.0 or higher is required. Update Node on your system.');
}

require('dotenv').config();
const port = process.env.PORT || 8080;
const express = require('express');
const app = new express();
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

const Discord = require('discord.js');

// configure settings for rendering web pages
app.set('view engine', 'pug');
app.set('views', __dirname + '/web/views');
app.use(express.static(__dirname + '/web/public'));

const Bot = new Discord.Client({ disableEveryone: false });

// add the helper functions specific to the bot
const loadCommand = require('./helpers/loadCommand');
const loadPokemon = require('./helpers/pokemon/loadPokemon');
const loadTrainers = require('./helpers/pokemon/loadTrainers');

Bot.cooldowns = [];
Bot.commands = new Map();
Bot.servers = new Map();

// pokemon collection game
Bot.browsing = new Map();
Bot.exploring = new Map();
Bot.pokemon = new Map();
Bot.pokemonEmojis = new Map();
Bot.pokemonGroups = new Map();
Bot.trainers = new Map();

Bot.logger = require('./helpers/logger').createLogger('snowflake.log');

require('./web/router')(app, Bot);

const initBot = async () => {

  // load the pokemon and trainers information
  loadPokemon(Bot);
  loadTrainers(Bot);

  // load the command files
  const commandFiles = await readdir('./commands/');
  commandFiles.forEach(fn => {
    if (!fn.endsWith(".js")) return;
    loadCommand(Bot, fn);
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