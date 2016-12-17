
module.exports = function(config){
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    /* Important to have here all files related to the project.
       Double check your dependencies in Angular module and HTML. */
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-translate/dist/angular-translate.min.js',
      'node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'https://d5wfroyti11sa.cloudfront.net/prod/client/ts-5.0.2-beta.2.min.js?internal',
      'https://cdn.jsdelivr.net/lodash/4.14.0/lodash.min.js',
      'browser/javascripts/app.js',
      'browser/javascripts/home.controller.js',
      'browser/tests/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
};
