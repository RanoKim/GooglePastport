'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
//var config = require('./config.json');

//var GOOGLE_CLIENT_ID = config.google.clientId;
//var GOOGLE_CLIENT_SECRET = config.google.clientSecret;

var token;

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


passport.use(new GitHubStrategy({
        clientID: 'b256ca5c8ad48c0a2646',
        clientSecret: '668f94323666bf0581c309f35ff6fb42584bc5d9',
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        var user;
        console.log('Passort token : ' + accessToken)
      console.log('Passort refreshToken : ' + refreshToken)
      token = accessToken
        if (profile) {
            user = profile;
            return done(null, user);
        }
        else {
            return done(null, false);
        }
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


    app.get('/auth/github',
        passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', {failureRedirect: '/login'}),
        function (req, res) {
            // Successful authentication, redirect home.
            console.log('GITHUB Callback : ' + token)
            res.redirect('http://localhost:8080/?access-token=' + token);
        });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
};

exports.setup = setup;
