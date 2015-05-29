angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
})

.controller('TestCtrl', function($scope, testInfo, $stateParams,$state, $ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);
    $scope.title = "Question #"+$stateParams.testID;
    $scope.index = $stateParams.testID;
    testInfo.forEach(function(infoDict)
    {   
        if(infoDict.Answer_ID === "A")
            $scope.questionA = infoDict;
        if(infoDict.Answer_ID === "B")
            $scope.questionB = infoDict;
    });
    
    $scope.buttonClicked = function ( option ) {
        var nextIndex = Number($scope.index) +1;
        if(nextIndex>30)
        {
            $state.go('test.results');
        }else {
            $state.go('test.detail',{testID:nextIndex});
        }
        
    };
})

.controller('RegisterCtrl', function($scope, $state, UserModel, $ionicNavBarDelegate) {
    
    $scope.user = {};
    $ionicNavBarDelegate.showBackButton(true);
    $scope.signupForm = function(form)
    {
        
        if($scope.user.password !== $scope.user.password2)
        {
            alert("Passwords must be the same");
        }else if(form.$valid){
            
            //Remove password2 from the dictionary
            delete $scope.user.password2;
             //$http service returns a promise
            UserModel.create($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    console.log(response);
                    $state.go('test.lobby');
                } else {
                    // invalid response
                }
            }, function(response) {
                // something went wrong
                console.log(response);
            });
        }
    };
})
.controller('LoginCtrl', function($scope, $window , $state, UserModel, $ionicNavBarDelegate) {
    $scope.user = {};
    $ionicNavBarDelegate.showBackButton(true);
    $scope.loginSubmitForm = function(form)
    {
        if(form.$valid)
        {   
            UserModel.login($scope.user)
            .then(function(response) {
                if (response.status === 200) {
                    //Should return a token
                    $window.localStorage['token'] = response.data.id;
                    $state.go('test.lobby');
                } else {
                    // invalid response
                }
    
            }, function(response) {
                // something went wrong
                console.log(response);
                console.log(response.status);
                alert("Password o usuario incorrecto");
            });
        }
    };
})

.controller('LobbyCtrl', function($scope, $window, $ionicHistory, $ionicNavBarDelegate, $state, ServerQuestionModel, QuestionModel, UserModel) {
    $scope.user = {};
    $ionicHistory.clearHistory();
    $ionicNavBarDelegate.showBackButton(false);
    ServerQuestionModel.all()
    .then(function(response) {
        if (response.status === 200) {
            //Should return a token
            var questions = response.data;
            QuestionModel.setQuestions(questions);
        } else {
            // invalid response
        }

    }, function(response) {
        // something went wrong
        console.log(response);
        console.log(response.status);
    });
    
    $scope.logout = function()
    {
        delete $window.localStorage['token'];
        $state.go("test.home");
        $ionicHistory.clearCache();
        //logout not working
     /*   var tokenDictionary = {"access_token" : $window.localStorage['token']};
        UserModel.logout(tokenDictionary)
         .then(function(response) {
            if (response.status === 200) {
                //Should return a token
                delete $window.localStorage['token'];
                $state.go("test.home");
                $ionicHistory.clearHistory();
            } else {
                // invalid response
            }
    
        }, function(response) {
            // something went wrong
            console.log(response);
            console.log(response.status);
        });*/
    };
});