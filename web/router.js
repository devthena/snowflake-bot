
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DB_NAME = process.env.DB_NAME;
const SCOPES = ['identify'];
const SESSION_SECRET = process.env.SESSION_SECRET;
const REDIRECT_URI = process.env.AUTH_REDIRECT_URI;
const REDIRECT_URI_LOCAL = process.env.AUTH_REDIRECT_URI_LOCAL;

const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const DiscordStrategy = require('passport-discord').Strategy;

const serverLog = require('../helpers/serverLog');

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
    callbackURL: Bot.isLocal ? REDIRECT_URI_LOCAL : REDIRECT_URI,
    scope: SCOPES

  }, fetchUserData));

  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // render: main page
  app.get('/', (req, res) => {
    var payload = { type: 'landing' };
    if (req.isAuthenticated()) {
      var user = req.session.passport.user;
      payload.profile = user.profile;
    }
    res.render('index', payload);
  });

  // render: commands page
  app.get('/commands', (req, res) => {
    var payload = {
      type: 'commands',
      metaTitle: 'Snowflake Bot | Commands'
    };
    if (req.isAuthenticated()) {
      var user = req.session.passport.user;
      payload.profile = user.profile;
    }
    res.render('index', payload);
  });

  // render: faq page
  app.get('/faq', (req, res) => {
    var payload = {
      type: 'faq',
      metaTitle: 'Snowflake Bot | FAQ'
    };
    if (req.isAuthenticated()) {
      var user = req.session.passport.user;
      payload.profile = user.profile;
    }
    res.render('index', payload);
  });

  // render: dashboard page
  app.get('/dashboard', checkAuth, (req, res) => {
    if (req.isAuthenticated()) {
      var user = req.session.passport.user;
      res.render('index', {
        type: 'dashboard',
        metaTitle: 'Snowflake Bot | Dashboard',
        profile: user.profile,
        servers: user.servers,
        isRegistered: user.isRegistered
      });
    } else {
      res.redirect('/');
    }
  });

  //render: server page
  app.get('/dashboard/:id', checkAuth, (req, res) => {

    if (req.isAuthenticated()) {

      var user = req.session.passport.user;

      if (user.isRegistered) {

        var serverID = req.params.id;
        var selectedServer = user.servers.find(server => server.id === serverID);

        if (selectedServer) {

          var server = Bot.servers.get(serverID);
          
          selectedServer.channels = server.channels;
          selectedServer.mods = server.mods;
          selectedServer.roles = server.roles;
          selectedServer.settings = server.settings;

          res.render('index', {
            type: 'server',
            metaTitle: 'Snowflake Bot | Server',
            profile: user.profile,
            server: selectedServer
          });

        } else {

          res.render('index', {
            type: 'error',
            profile: user.profile,
            headline: 'Server Not Found',
            message: 'Please contact Athena regarding this issue.'
          });

        }

      } else {
        req.logout();
        res.redirect('/unregistered');
      }

    } else {
      res.redirect('/');
    }
  });

  // render: unregistered page
  app.get('/unregistered', (req, res) => {
    res.render('index', {
      type: 'error',
      headline: 'Well, this is awkward...',
      message: 'Only registered users are able to access the dashboard. If you think this is a mistake, please contact Athena.'
    });
  });

  // user: login
  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord',
    { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/dashboard');
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
    var user = { profile: profile };

    Bot.guilds.cache.forEach(guild => {
      if (guild.ownerID === profile.id) {
        var server = Bot.servers.get(guild.id);
        if (server) {
          serverList.push({
            id: guild.id,
            name: guild.name,
            available: guild.available,
            iconImage: guild.iconURL() || null,
            memberCount: guild.memberCount
          });
        }
      }
    });

    var discordTag = `${profile.username}#${profile.discriminator}`;

    let logEvent = {
      author: 'Snowflake Web',
      message: `User Log In: ${discordTag}\nDiscord User ID: ${profile.id}`,
      footer: new Date(),
      type: 'default'
    };

    serverLog(Bot, logEvent);

    if (serverList.length > 0) {

      user.isRegistered = true;
      user.servers = serverList;
      return done(null, user);

    } else {
      return done(null, user);
    }
  }

  app.post('/api/server/update', checkAuth, (req, res) => {

    var serverID = req.body.id;
    var serverUpdates = req.body.updates;
    var serverInfo = Bot.servers.get(serverID);
    var isSuccess = false;
    var errorMessage = null;

    serverInfo.channels = serverUpdates.channels;
    serverInfo.mods = serverUpdates.mods;
    serverInfo.roles = serverUpdates.roles;
    serverInfo.settings = serverUpdates.settings;

    // update the server Map
    Bot.servers.set(serverID, serverInfo);

    // update the database
    var db = new sqlite3.Database(`./${DB_NAME}`, (error) => {
      if (error) return Bot.logger.error(`[DB] Cannot establish connection to database: ${error}`);
      Bot.logger.info('[DB] Established connection to database (web.js - api/server/update)');
    });

    var sql = `UPDATE guilds SET channels = ?, mods = ?, roles = ?, settings = ? WHERE server_id = ?`;

    var stringValues = [
      JSON.stringify(serverUpdates.channels),
      JSON.stringify(serverUpdates.mods),
      JSON.stringify(serverUpdates.roles),
      JSON.stringify(serverUpdates.settings),
      serverID
    ];

    db.run(sql, stringValues, function (error) {
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
