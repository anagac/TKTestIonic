angular.module('RESTConnection', [])
  .constant('ENDPOINT_URI', 'https://toyapp-rcorbeil.c9.io/api/')
  .constant('QUESTION_NUMBER','Question_Number')
  .service('ServerQuestionModel', function ($http, ENDPOINT_URI, QUESTION_NUMBER) {
    var service = this,
    path = 'Questions/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }

    function getUrlForId(itemId) {
      return getUrl(path) + itemId;
    }

    service.all = function () {
      return $http.get(getUrl());
    };

    service.fetch = function (questionId) {
      return $http.get(getUrlForId(questionId));
    };
    
    service.fetchWithFilter = function(questionId) {
      
      return $http.get(getUrl()+"?filter[where]["+QUESTION_NUMBER+"]="+questionId);
    };
    service.create = function (question) {
      return $http.post(getUrl(), question);
    };

    service.update = function (itemId, question) {
      return $http.put(getUrlForId(itemId), question);
    };

    service.destroy = function (itemId) {
      return $http.delete(getUrlForId(itemId));
    };
  })
  
  .service('UserModel', function ($http, ENDPOINT_URI) {
    var service = this,
    path = 'SSFUsers/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }

    function getUrlForId(itemId) {
      return getUrl(path) + itemId;
    }

    service.all = function () {
      return $http.get(getUrl());
    };

    service.fetch = function (userId) {
      return $http.get(getUrlForId(userId));
    };
    
    service.create = function (user) {
      return $http.post(getUrl(), user);
    };

    service.update = function (userId, user) {
      return $http.put(getUrlForId(userId), user);
    };

    service.destroy = function (userId) {
      return $http.delete(getUrlForId(userId));
    };
    
    service.login = function(user) {
      return $http.post(getUrl()+"/login",user);
    };
    
    service.logout = function(token) {
      console.log(token);
      return $http.post(getUrl()+"/logout",token);
    };
  });