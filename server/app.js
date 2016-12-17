var express = require('express');
var path = require('path');
var engine = require('consolidate'); // we need this to set HTML engine
var routes = require('./routes/index');
var app = express();
var i18n = require('i18n');
var session = require('express-session');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var auth = require('./lib/auth');
var config = require('./config/config');

/* Configuring server-side locales */
i18n.configure({
    locales: ['en', 'ru'],
    directory: __dirname + '/locales',
    defaultLocale: 'en'
});

if (process.env.NODE_ENV === 'development'){
  app.use(errorHandler())
}
/* view engine setup */
app.set('views', path.join(__dirname, '../browser/views'));
app.engine('html', engine.mustache);
app.set('view engine', 'html');

/* Initializing middleware, such as session, passport, bodyParser & i18n */
app.use(session({
  secret: config.clientSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(auth.initialize());
app.use(auth.session());
app.use(bodyParser.json());
app.use(i18n.init);
app.use(express.static(path.join(__dirname, '../browser')));
app.use('/', routes);

module.exports = app;
