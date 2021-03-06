// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'RESTConnection','SSFServices', 'chart.js', 'CameraWrapper'])

.run(function($ionicPlatform, $state, $window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    if($window.localStorage["userID"]!==undefined)
    {
        $state.go("test.lobby");
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text(' ');

})
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      },
      requestError: function(reason) {
        $rootScope.$broadcast('loading:hide');
        return reason;
      },
      responseError: function(response) {
        console.log(response);
        $rootScope.$broadcast('loading:hide');
        if(response.status === 401 && (response.data.error.code === "INVALID_TOKEN" || response.data.error.code === "AUTHORIZATION_REQUIRED"))
        {
          $rootScope.$broadcast('request:auth');
        }
        return response;
      }
    };
  });
})

.run(function($rootScope, $ionicLoading, $state, $ionicHistory, $window) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner ></ion-spinner>'
    });
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });
  
  $rootScope.$on('request:auth', function() {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });
    delete $window.localStorage['token'];
    delete $window.localStorage['userID'];
    $state.go('test.home');
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/test/');

  $stateProvider
  
  .state('test', {
    abstract: true,
    url: '/test',
    template: '<ion-nav-view></ion-nav-view>'
  })
  .state('test.home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })
  .state('test.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller:"LoginCtrl"
  })
  .state('test.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller:"RegisterCtrl"
  })
  .state('test.lobby', {
    url: '/lobby',
    templateUrl: 'templates/lobby.html',
    controller: 'LobbyCtrl'
  })
  .state('test.results', {
    url: '/results',
    templateUrl: 'templates/results.html',
    controller: 'ResultsCtrl'
  })
  .state('test.history', {
    url: '/history',
    templateUrl: 'templates/history.html',
    controller: 'HistoryCtrl'
  })
  
  .state('test.detail', {
    url: '/:testID',
    templateUrl: 'templates/test.html',
    controller: 'TestCtrl',
    resolve: {
      testInfo: function($stateParams, QuestionModel) {
        return QuestionModel.getQuestion($stateParams.testID);
      }
    }
  });
});