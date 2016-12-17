var app = angular.module('tradeshiftApp', ['pascalprecht.translate']);
app.config(function($locationProvider, $translateProvider){
  $locationProvider.html5Mode({enabled: true, requireBase: false});
  $translateProvider
    .useStaticFilesLoader({ // load our locales
      prefix: 'locales/',
      suffix: '.json'
    })
    .useSanitizeValueStrategy('escape')
    .registerAvailableLanguageKeys(['en', 'ru'])
    .determinePreferredLanguage(function(){ // choose the best language based on browser languages
      var translationKeys = $translateProvider.registerAvailableLanguageKeys(),
          browserKeys = navigator.languages,
          preferredLanguage;

      label: for (var i = 0; i < browserKeys.length; i++){
        for (var j = 0; j < translationKeys.length; j++){
          if (browserKeys[i] == translationKeys[j]){
            preferredLanguage = browserKeys[i];
            break label;
          }
        }
      }
      return preferredLanguage;
    });
});

app.factory('$req', function($http, $location){
    var url = $location.absUrl(); // setting absolute URL
    return {
      getAccountData: function(){
        return $http.get(url + 'account/info');
      },
      getGridData: function(){
        return $http.get(url + 'demo/grid-data');
      },
      getDocuments: function(documentType){ // Calling Tradeshift documents
        return $http.get(url + '/document/documents', {
          params: {documentType: documentType}
        });
      },
      getHealth: function(){
        return $http.get(url + 'health');
      },
      getJWTInfo: function(){
        return $http.get(url + '/jwt/id-token');
      },

      /* in case if you want to get your locales from server, currently not used */
      getLocale: function(){
        return $http.get(url + 'locale');
      },

      /* Tasks API */
      getTasksPage: function(){
        return $http.get(url + '/tasks', {
          params: {
            limit: 25,
            pageNumber: 0
          }
        });
      },
      completeTask: function(taskId){
        return $http.put(url + 'tasks/complete/' + taskId,
          {},
          {params: {action: "complete"}}
        );
      },
      createTask: function(){
        return $http.post(url + 'tasks');
      },
      sendFailingRequest: function(status) {
        if (status === 404){
          return $http.get(url + 'random-url'); // Simulate request on non existing url
        } else if (status === 400){
          return $http.get(url + 'demo/grid-data?fail=1'); // Simulate bad request
        }
      }
    }
  });
