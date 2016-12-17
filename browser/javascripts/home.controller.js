
app.controller('HomeCtrl', function($scope, $req, $window, $translate, $q){

    $scope.ui = ts.ui; // So that we can access UIC from our template
    $scope.aside = ts.ui.get('#home-aside');
    $scope.table = ts.ui.get('#home-table');
    $scope.topbar = ts.ui.get('#home-topbar');
    $scope.card = ts.ui.get('#home-card');
    $scope.showTab = 0;
    $scope.eventList = [];

    $q.all([
      $translate(['Table.ID', 'Table.Character', 'Table.Alignment', // getting our i18n data
        'Topbar.Intro', 'Topbar.Table', 'Topbar.Buttons', 'Topbar.Health', 'Topbar.Documents', 'Topbar.JWTTokenInfo', 'Topbar.Error',
        'Topbar.TaskList', 'Topbar.WebHooks', 'Topbar.CompanyCard', 'Message.Oopsie daisy!', 'Message.Good job!', 'Message.Server is running!']),
      // $req.getDocuments('invoice'),
      $req.getGridData(),
      // $req.getJWTInfo(),
      // $req.getTasksPage(),
      $req.getAccountData()
    ]).then(function(response){
      /* Locale response */
      var locale = response[0];

      /* Documents response */
      // $scope.documents = response[1].data;

      /* Grid data */
      $scope.data = $scope.getArray(response[1].data); // Usually 2

      /* JWT */
      // $scope.jwtInfo = response[3].data;
      // $scope.jwtInfo.formatedExpTime = new Date($scope.jwtInfo.expirationTime).toUTCString();
      // $scope.jwtInfo.formatedIssuedAtTime = new Date($scope.jwtInfo.issuedAtTime).toUTCString();

      /* Tasks */
      // $scope.tasks = response[4].data;
      // taskDateTimeToDate($scope.tasks);

      /* Account info */
      $scope.info = response[2].data['ts:CompanyAccountInfo'];
      if ($scope.info){
        /* Here we are rendering CompanyCard UI Component */
        $scope.card.render({
          id: $scope.info['ts:CompanyAccountId'][0],
          data: {
            name: $scope.info['ts:CompanyName'] ? $scope.info['ts:CompanyName'][0] : 'none',
            location: $scope.info['ts:Country'] ? $scope.info['ts:Country'][0] : 'none',
            size: $scope.info['ts:Size'][0] ? $scope.info['ts:Size'][0] : 'none',
            connection: 0,
            industry: $scope.info['ts:Industry'] ? $scope.info['ts:Industry'][0] : 'none',
            logo: $scope.info['ts:LogoURL'] ? $scope.info['ts:LogoURL'][0] : 'none'
          }
        });
      }

      /* Helper method for getting proper notification */
      $scope.getNotification = function(type){
          if (type == 'success'){
            return ts.ui.Notification.success(locale['Message.Good job!']);
          } else if (type == 'alert'){
            return ts.ui.Notification.error(locale['Message.Oopsie daisy!']);
          }
        };

      /* Initializing topbar tabs */
      $scope.topbar
        .tabs([
          {
            label: locale['Topbar.Intro'],
            id: 'tab0',
            icon: 'ts-icon-discovery',
            onselect: function(){
              $scope.showTab = 0;
              $scope.$digest();
              scrollTo(0, 0);
            }
          },
          {
            label: locale['Topbar.Table'],
            id: 'tab1',
            icon: 'ts-icon-apps',
            onselect : function(){
              $scope.showTab = 1;
              $scope.$digest();
              scrollTo(0,0);
            }
          },
          {
            label: locale['Topbar.Buttons'],
            icon: 'ts-icon-activity',
            id: 'tab2',
            onselect: function(){
              $scope.showTab = 2;
              $scope.$digest(); // executing outside of angular
              scrollTo(0,0);
            }
          },
          {
            label: locale['Topbar.Health'],
            icon: 'ts-icon-code',
            id: 'tab3',
            onselect: function(){
              $scope.showTab = 3;
              $scope.$digest();
              scrollTo(0,0);
            }
          },
          // {
          //   label: locale['Topbar.Documents'],
          //   icon: 'ts-icon-alldocuments',
          //   id: 'tab4',
          //   onselect: function(){
          //     $scope.showTab = 4;
          //     $scope.$digest();
          //     scrollTo(0, 0);
          //   }
          // },
          // {
          //   label: locale['Topbar.JWTTokenInfo'],
          //   icon: 'ts-icon-info',
          //   id: 'tab5',
          //   onselect: function(){
          //     $scope.showTab = 5;
          //     $scope.$digest();
          //     scrollTo(0, 0);
          //   }
          // },
          // {
          //   label: locale['Topbar.TaskList'],
          //   icon: 'ts-icon-heart',
          //   id: 'tab6',
          //   onselect: function(){
          //     $scope.showTab = 6;
          //     $scope.$digest();
          //     scrollTo(0, 0);
          //   }
          // },
          {
            label: locale['Topbar.WebHooks'],
            icon: 'ts-icon-reset',
            id: 'tab7',
            onselect: function () {
              $scope.showTab = 7;
              $scope.$digest();
              scrollTo(0, 0);
            }
          },
          {
            label: locale['Topbar.CompanyCard'],
            icon: 'ts-icon-favorites',
            id: 'tab8',
            onselect: function(){
              $scope.showTab = 8;
              $scope.$digest();
              scrollTo(0,0);
            }
          },
          {
            label: locale['Topbar.Error'],
            icon: 'ts-icon-error',
            id: 'tab9',
            onselect: function() {
              $scope.showTab = 9;
              $scope.$apply();
              scrollTo(0,0);
            }
          }
        ])
        .dark();

      /* Table - loading after data is ready */
      $scope.table
        .selectable()
        .cols([
          {
            label: locale['Table.ID'], search: {
            tip: 'Search by ID',
            onidle: function(value){
              $scope.table.search(0, value);
            }}
          },
          {label: locale['Table.Character'], flex: 2, wrap: true},
          {label: locale['Table.Alignment'], flex: 2}
        ])
        .rows($scope.data)
        .sortable(function(index, ascending){
          $scope.table.sort(index, ascending);
        })
        .max(3)
        .editable(function onedit(ri, ci, value){
          this.cell(ri, ci, value);
        })
        .sort(0, true);
    }, function(err){
      console.log(err);
    });

    var taskDateTimeToDate = function(tasks){
      tasks.forEach(function(task, i){
        tasks[i].createdOn = new Date(task.createdOn.millis).toUTCString();
        if (tasks[i].completedOn !== null){
          tasks[i].completedOn = new Date(tasks[i].completedOn.millis).toUTCString();
        }
      });
    };

    /* get array of arrays from array of objects */
    $scope.getArray = function(data){
      var result = [];
      data.forEach(function(item){
        var array = [];
        for (p in item){
          array.push(item[p] + ''); // here we get array of strings
        }
        result.push(array);
      });
      return result; // array of arrays
    };

    /* Checks if server is up */
    $scope.checkHealth = function(){
      $req.getHealth().then(function(response){
        ts.ui.Notification.success(response.data);
      }, function(response){
        ts.ui.Notification.error(response.status + ' ' + response.statusText);
      })
    };

    /* For error handling */
    $scope.sendFailingRequest = function(status){
      $req.sendFailingRequest(status).catch(function(response){
        ts.ui.Notification.error(response.status + ' ' + response.statusText);
      })
    };

  if (window.EventSource) { // Check if browser supports ES
    var es = new EventSource('/sse');
    es.onmessage = function(e){ // handler when we receive message from server
      $scope.eventList.push(JSON.parse(e.data));
      $scope.$digest();
    };
  } else {
    console.warn("No SSE available");
  }
  });


