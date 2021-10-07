const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const LOCAL = process.env.LOCAL;
const SCOPES = ['identify'];
const SESSION_SECRET = process.env.SESSION_SECRET;

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;

const isTrue = require('../helpers/isTrue');
const serverLog = require('../helpers/serverLog');

const REDIRECT_URI = isTrue(LOCAL) ? process.env.AUTH_REDIRECT_URI_LOCAL : process.env.AUTH_REDIRECT_URI;

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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // render: main page
  app.get('/', (req, res) => {

    let payload = { type: 'landing' };

    if (req.isAuthenticated()) {
      const user = req.session.passport.user;
      payload.profile = user.profile;
    }

    res.render('index', payload);
  });

  // render: commands page
  app.get('/commands', (req, res) => {

    let payload = {
      type: 'commands',
      metaTitle: 'Snowflake Bot | Commands'
    };

    if (req.isAuthenticated()) {
      const user = req.session.passport.user;
      payload.profile = user.profile;
    }

    res.render('index', payload);
  });

  // render: faq page
  app.get('/faq', (req, res) => {

    let payload = {
      type: 'faq',
      metaTitle: 'Snowflake Bot | FAQ'
    };

    if (req.isAuthenticated()) {
      const user = req.session.passport.user;
      payload.profile = user.profile;
    }

    res.render('index', payload);
  });

  // render: dashboard page
  app.get('/dashboard', checkAuth, (req, res) => {

    if (req.isAuthenticated()) {

      const user = req.session.passport.user;

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

      const user = req.session.passport.user;

      if (user.isRegistered) {

        const serverId = req.params.id;
        let selectedServer = user.servers.find(server => server.id === serverId);

        if (selectedServer) {

          const server = Bot.servers.get(serverId);
          
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

    let serverList = [];
    let user = { profile: profile };

    Bot.guilds.cache.forEach(guild => {
      if (guild.ownerId === profile.id) {
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

    const discordTag = `${profile.username}#${profile.discriminator}`;

    let logEvent = {
      author: 'Snowflake Web',
      message: `User Log In: ${discordTag}\nDiscord User ID: ${profile.id}`,
      footer: new Date().toString(),
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

    const serverId = req.body.id;
    const serverUpdates = req.body.updates;
    
    let serverInfo = Bot.servers.get(serverId);
    serverInfo.channels = serverUpdates.channels;
    serverInfo.mods = serverUpdates.mods;
    serverInfo.roles = serverUpdates.roles;
    serverInfo.settings = serverUpdates.settings;

    Bot.servers.set(serverId, serverInfo);

    Bot.db.collection('guilds').updateOne({ serverId: serverId }, {
      $set: {
        channels: JSON.stringify(serverUpdates.channels),
        mods: JSON.stringify(serverUpdates.mods),
        roles: JSON.stringify(serverUpdates.roles),
        settings: JSON.stringify(serverUpdates.settings)
      }
    }, err => {
      if(err) {
        res.send({ success: false, error: JSON.stringify(errorMessage) });
        Bot.logger.error(`[DB] Cannot update server database: ${ JSON.stringify(err) }`);
      } else {
        res.send({ success: true, error: null });
      }
    });

  });

};
