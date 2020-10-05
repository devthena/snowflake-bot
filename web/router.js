
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DB_NAME = process.env.DB_NAME;
const SCOPES = ['identify'];
const REDIRECT_URI = process.env.AUTH_REDIRECT_URI;
// const REDIRECT_URI = process.env.AUTH_REDIRECT_URI_LOCAL;

const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const DiscordStrategy = require('passport-discord').Strategy;

const activeUsers = new Map();

module.exports = (app, Bot) => {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.use(new DiscordStrategy({

    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
    scope: SCOPES

  }, fetchUserData));

  app.use(session({
    secret: 'athenabliss',
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // render: home page
  app.get('/', (req, res) => {
    res.render('home');
  });

  // render: commands page
  app.get('/commands', (req, res) => {
    res.render('commands');
  });

  // render: faq page
  app.get('/faq', (req, res) => {
    res.render('faq');
  });

  // render: dashboard page
  app.get('/dashboard', checkAuth, (req, res) => {

    if (req.session.passport.user.isRegistered) {

      var userID = req.session.passport.user.id;
      var activeUser = activeUsers.get(userID);
      res.render('admin/dashboard', activeUser);

    } else {
      req.logout();
      res.redirect('/unregistered');
    }
  });

  //render: server page
  app.get('/dashboard/:id', checkAuth, (req, res) => {

    if (req.session.passport.user.isRegistered) {

      var userID = req.session.passport.user.id;
      var activeUser = activeUsers.get(userID);
      var serverID = req.params.id;

      var currentServer = null;
      var currentGuild = activeUser.guilds.find(function (guild) { return guild.id === serverID });

      if (currentGuild) {
        currentServer = activeUser.servers.find(function (server) { return currentGuild.id === serverID });
      }

      if (currentServer) {
        res.render('admin/server', {
          profile: activeUser.profile,
          guild: currentGuild,
          server: currentServer
        });
      } else {
        var error = {
          headline: 'Server Not Found',
          message: 'Please contact Athena regarding this issue.'
        }
        res.render('error', error);
      }

    } else {
      req.logout();
      res.redirect('/unregistered');
    }
  });

  // render: unregistered page
  app.get('/unregistered', (req, res) => {
    var error = {
      headline: 'Well, this is awkward...',
      message: 'Only registered users are able to access the dashboard. If you think this is a mistake, please contact Athena. :)'
    };
    res.render('error', error);
  });

  // user: login
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord',
    { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/dashboard')
    }
  );

  // user: logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // check if user is authenticated
  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
  }

  // fetch user data from database to see if user is registered
  function fetchUserData(accessToken, refreshToken, profile, done) {

    var serverList = []; // server info list
    var guildList = [];  // bot guild list
    var user = { id: profile.id, isRegistered: false };

    Bot.guilds.cache.forEach(guild => {
      if (guild.ownerID === profile.id) {
        var server = Bot.servers.get(guild.id);
        if (server) serverList.push(server);
        guildList.push(guild);
      }
    });

    var discordTag = `${profile.username}#${profile.discriminator}`;

    if (guildList.length > 0) {

      Bot.logger.info(`[WEB] User found: ${discordTag}`);

      var activeUser = {
        profile: profile,
        guilds: guildList,
        servers: serverList
      };

      user.isRegistered = true;
      activeUsers.set(profile.id, activeUser);
      return done(null, user);

    } else {
      Bot.logger.warn(`[WEB] User not registered: ${discordTag}`);
      return done(null, user);
    }
  }

  app.post('/api/server/update', checkAuth, (req, res) => {

    var serverID = req.body.id;
    var serverUpdates = req.body.updates;
    var serverInfo = Bot.servers.get(serverID);
    var isSuccess = false;
    var errorMessage = null;

    serverInfo.mods = serverUpdates.mods;
    serverInfo.roles = serverUpdates.roles;
    serverInfo.channels = serverUpdates.channels;

    // update the server Map
    Bot.servers.set(serverID, serverInfo);

    // update the database
    var db = new sqlite3.Database(`./${DB_NAME}`, (error) => {
      if (error) return Bot.logger.error(`[DB] Cannot establish connection to database: ${error}`);
      Bot.logger.info('[DB] Established connection to database (web.js - api/server/update)');
    });

    var stringMods = `mod_alert_stream = ?, mod_auto_add = ?, mod_game_8ball = ?, mod_game_gamble = ?, mod_highlight_board = ?, mod_optins = ?`;
    var stringRoles = `role_auto_add = ?, role_moderator = ?, role_optins = ?`;
    var stringChannels = `channel_alert_stream = ?, channel_highlight_board = ?`;
    var sql = `UPDATE guilds SET ${stringMods}, ${stringRoles}, ${stringChannels} WHERE server_id = ?`;

    var stringValues = [
      serverUpdates.mods.alertStream,
      serverUpdates.mods.autoAdd,
      serverUpdates.mods.game8Ball,
      serverUpdates.mods.gameGamble,
      serverUpdates.mods.highlightBoard,
      serverUpdates.mods.optins,
      serverUpdates.roles.autoAdd,
      serverUpdates.roles.moderator,
      serverUpdates.roles.optins,
      serverUpdates.channels.alertStream,
      serverUpdates.channels.highlightBoard,
      serverID
    ];

    db.get(sql, stringValues, function (error) {
      if (error) {
        Bot.logger.error(`[DB] Cannot update server database: ${error}`);
        errorMessage = error;
      } else {
        isSuccess = true;
      }
    });

    db.close((error) => {
      if (error) return Bot.logger.error(`[DB] Cannot close database: ${error}`);
      Bot.logger.info('[DB] Disconnected to the database (web.js - api/server/update)');
      res.send({ success: isSuccess, error: errorMessage });
    });
  });
};