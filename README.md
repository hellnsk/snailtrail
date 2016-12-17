# Snail Trail Application

. ./config.sh && npm start

# ===============================================================================

# Tradeshift Third Party Embedded App Sample - Node.js + Angular + Tradeshift UI Components

## Description
This is a sample project which shows how to create an embedded app on Tradeshift using Node.js backend, with Angular.js on frontend, utilizing Tradeshift's [UI Components](http://ui.tradeshift.com).

The app authenticates with Tradeshift server using OAUTH2, and retrieves current company data as an example of calling Tradeshift API.  The app needs to be run inside Tradeshift platform to fully work - see documentation [here](http://apps.tradeshift.com/documentation). This sample app has multiple language supportusing English and Russian languages.  To add languages, add files to browser/locales directory.

## Requirements
- [Node.js](https://nodejs.org/en/) version 4 and higher
- Application on Tradeshift [App Developer](https://sandbox.tradeshift.com/#/apps/Tradeshift.Developer/)

## Back-end REST API

Action          | Request   | URL
--------------- | --------- | ----------------
Check health      |   GET     | /health
Get locale      |   GET     | /locale
Company info    |   GET     | /account/info
Demo table      |   GET     | /demo/grid-data
Webhook listener | POST | /webhooks

## Build
You can build and run project on your local server(`localhost`):
- Add environment variables shown in `config/config.js`. For more information on adding env vars see [here](https://github.com/lorenwest/node-config/wiki/Environment-Variables)
- Install dependencies - `npm install`
- To allow you to develop locally but access Tradeshift servers, use [ngrok](https://ngrok.com/docs#expose) or similar tools, which allow you to expose a local server to the internet.
- Follow instructions in Tradeshift.Developer app to create a new App.  Documentation [here](http://apps.tradeshift.com/documentation).
- Configure your _OAUTH2 REDIRECT URI_ in the Tradeshift Developer app to `http://ngrokURL/oauth2/code`
- Update `redirectUri` in your `config/config.js` file (use _TRADESHIFT OAUTH2 REDIRECT URI_)
- Run server - `npm start` (or you may use [nodemon](http://nodemon.io/)` for auto reload)
- Go to Tradeshift account on sandbox and open the app you created in Tradeshift.Developer app.

## Deployment
You can easily deploy this project on [Heroku](https://www.heroku.com/), as follows:
- Create new Node.js app on Heroku and connect your local git repository with Heroku.
- Configure Heroku environment variables (`CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`) with data from your Tradeshift App in Heroku app settings.
- Deploy on Heroku (see deploy app documentation)
- Update Main URL in Tradeshift.Developer app to point to the deployed App URL.

## Testing
Project uses Karma/Jasmine for testing Angular app and Mocha/Supertest for testing server side. For running tests you need to:
- Install dependencies via `npm install`
- Run `npm test` for server side test run
- Run `karma start karma.config.js` for client side test run

## Notes
- By default, the app points to Tradeshift's sandbox, if you want to change it to production - change `SERVER_URL` (see `tradeshiftAPIServerURL` in `config/config.js`)
- This sample has no persistence, only small config file. For production level application you will likely need to add database of your choice.
- For internationalization, we implemented both on client and server-side, but by default use client-side. Working sample API is provided. For client side we've used [`angular-translate` module](https://angular-translate.github.io/)
- For authorization, we used [Passport.js](http://passportjs.org/) which allows us to authenticate easily with Tradeshift using OAuth 2.0
