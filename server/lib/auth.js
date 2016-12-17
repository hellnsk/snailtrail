var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var base64 = require('base-64');
var config = require('../config/config');
var jwt = require('jwt-simple');

/* Authorization token for getting Tradeshift access_token */
var authToken = base64.encode(config.clientId + ':' + config.clientSecret);

/* functionwhich checks config variables */
function checkConfig(config){
  if (config instanceof Object){
    for (key in config){
      if (!config[key]) throw new Error('No ' + key + ' provided.Please set it into your config variable.');
    }
  } else {
    throw new Error('Wrong argument in throwError(). Please, make sure that you pass an object.');
  }
}

checkConfig(config); // throw errors if config vars are not defined

/* Specifying new OAuth 2.0 strategy. For more info visit http://passportjs.org/docs */
var oauthStrategy = new OAuth2Strategy({
  authorizationURL: config.tradeshiftAPIServerURL + 'auth/login',
  tokenURL: config.tradeshiftAPIServerURL + 'auth/token',
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: config.redirectUri
}, function(accessToken, refreshToken, profile, done){
    done(null, {access_token: accessToken, refresh_token: refreshToken}); // return object containing tokens upon success
});

passport.serializeUser(function(user, done){
  done(null, jwt.encode(user, config.clientSecret));
});

passport.deserializeUser(function(user, done){
  done(null, jwt.decode(user, config.clientSecret));
});

/* Setting custom Authorization header */
oauthStrategy._oauth2.setAuthMethod('Basic');
oauthStrategy._oauth2._customHeaders = { Authorization: oauthStrategy._oauth2.buildAuthHeader(authToken)};
passport.use('tradeshift', oauthStrategy);

module.exports = passport;