// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'RESTConnection','ssf-services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
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