angular.module('RESTConnection', [])
  .constant('ENDPOINT_URI', 'https://c9toyapp1.herokuapp.com/api/')
  .constant('QUESTION_NUMBER','Question_Number')
  .service('ServerQuestionModel', function ($http,  ENDPOINT_URI, QUESTION_NUMBER) {
    var service = this,
    path = 'Questions/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }

    function getUrlForId(itemId) {
      return getUrl(path) + itemId;
    }

    service.all = function (token) {
      return $http.get(getUrl(), {
          params: { access_token: token }
      });
    };

    service.fetch = function (questionId) {
      return $http.get(getUrlForId(questionId));
    };
    
    service.fetchWithFilter = function(questionId) {
      
      return $http.get(getUrl()+"?filter[where]["+QUESTION_NUMBER+"]="+questionId);
    };

  })
  
  .service('UserModel', function ($http, ENDPOINT_URI) {
    var service = this,
    path = 'SSFUsers/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }
    
    service.create = function (user) {
      return $http.post(getUrl(), user);
    };
    
    service.login = function(user) {
      
      user["ttl"] = 1209600000;
      return $http.post(getUrl()+"/login",user);
    };
    
    service.logout = function(token) {
      console.log(token);
      return $http.post(getUrl()+"/logout",token);
    };
  })
  
  .service('ServerAnswersModel', function ($http, ENDPOINT_URI) {
    var service = this,
    path = 'TestResults/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }

    service.create = function(answer, token) {
      return $http.post(getUrl()+"?access_token="+token,answer); 
    };
    
    service.all = function(userID, token)
    {
      return $http.get(getUrl()+"?filter[where][userID]="+userID,{
          params: { access_token: token }
      });
    };
  });