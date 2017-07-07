'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
//var config = require('./config.json');

//var GOOGLE_CLIENT_ID = config.google.clientId;
//var GOOGLE_CLIENT_SECRET = config.google.clientSecret;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
      clientID: '891356871718-31ts0m6dpmmfqfma8v2h0neml22ftapu.apps.googleusercontent.com',
      clientSecret: 'nCxfo1-Wy6GWiZpnwtgzddju',
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
        console.log('token = ' + accessToken + ' / refreshToken = ' + refreshToken + ' / profile = ' + profile );

      process.nextTick(function () {

        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
));


var setup = function (app) {
    app.use(session({
        secret: 'keyboard cat',
        name: '',
        store: '', // connect-mongo session store
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google',
      passport.authenticate('google', { scope: ['openid', 'email'] }),
      function(req, res){
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
      });

  app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
        console.log(req.query);
        res.redirect('/account');
      });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
};

exports.setup = setup;
