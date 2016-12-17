var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');
var xml2js = require('xml2js');
var session = require('express-session');
var i18n = require('i18n');
var SSE = require('express-sse');
var sse = new SSE();
var passport = require('passport');

/* Function which checks config variables */
var throwError = function(variables){
  if (variables instanceof Object && !(variables instanceof Array)){
    for(key in variables) {
      if (!variables[key]) throw new Error('No ' + key + ' provided.Please set it into your config variable.');
    }
  } else {
    throw new Error('Wrong argument in throwError(). Please, make sure that you pass an object.');
  }
};

throwError({clientSecret: config.clientSecret}); // check if user has specified a client secret
router.use(session({ // Initialize session middleware so we can store there our token
  secret: config.clientSecret,
  resave: false,
  saveUninitialized: true
}));

router.get('/sse', sse.init);
/* GET home page. */
router.get('/', function(req, res){
  if (!req.user){ // If not authorized
    return res.redirect('/auth');
  }
  res.render('index');
});

/* Use passport to authenticate with Tradeshift */
router.get('/auth', passport.authenticate('tradeshift', {scope: 'offline'}));
router.get('/oauth2/code', passport.authenticate('tradeshift'), function(req, res){
  request = request.defaults({ // setting default auth header with received access_token token
    headers: { Authorization: 'Bearer ' + req.user.access_token }
  });
  res.redirect('/');
});

/* Get current account information */
router.get('/account/info', function(req, res){
  request.get({url: config.tradeshiftAPIServerURL + 'rest/external/account/info'},
    function(error, response, body){
       if (!error){
         xml2js.parseString(body, function(err, result){ // Parse XML
           res.json(result);
         })
       }  else {
         res.json(error);
       }
    })
});

/* Get mock data from server */
router.get('/demo/grid-data', function(req, res){
  if (req.query.fail){ // Simulating bad request for error handling
    return res.sendStatus(400);
  }
  res.send([
    {"id":1,"character":"Barbarian Queen","alignment":"Neutral Evil"},
    {"id":2,"character":"Global Senior Vice President of Sales","alignment":"Chaotic Evil"},
    {"id":3,"character":"Jonathan the Piggy","alignment":"Glorious Good"},
    {"id":4,"character":"Paladin Knight","alignment":"Lawful Good"},
    {"id":5,"character":"Potato Chip","alignment":"Radiant Good"}
  ])
});

/* API for requesting server-side locale */
router.get('/locale', function(req, res){
  res.send(i18n.getCatalog(req));
});

/* Check if server is up */
router.get('/health', function(req, res){
  res.send('Server is up and running!').status(200);
});

/* Listen for webhooks */
router.post('/webhooks', function(req, res){
  var msg = req.body.msg;
  if (msg) {
    sse.send({ // Send event to client
      id: msg.ObjectId,
      tsUserId: msg.SenderUserId,
      tsCompanyAccountId: msg.SenderCompanyAccountId,
      tsUserLanguage: msg.Language,
      event: msg.DispatchType
    });
    res.sendStatus(200);
  } else res.sendStatus(400);
});

module.exports = router;
