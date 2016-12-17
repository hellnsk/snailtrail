/* Main configuration file */
module.exports = {
    clientId:  process.env.CLIENT_ID, // your app's oauth2 client id
    clientSecret: process.env.CLIENT_SECRET, // your app's oauth2 client secret
    redirectUri:  process.env.REDIRECT_URI, // your app's oauth2 redirect URI
    tradeshiftAPIServerURL:  process.env.SERVER_URL || 'https://api-sandbox.tradeshift.com/tradeshift/' // main url of the requested server
};
