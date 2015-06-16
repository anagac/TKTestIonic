angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicHistory) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
})

.controller('TestCtrl', function($scope, testInfo, $window, $stateParams, $state, AnswersService, ServerAnswersModel, $ionicHistory) {
    //testInfo is passed in the router to indicate the index
 
    //$ionicNavBarDelegate.showBackButton(true);
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
       
        if(option === "A")
        {
            AnswersService.saveAnswer($scope.index, $scope.questionA.Style, option);
        }
        else if(option === "B")
        {
            AnswersService.saveAnswer($scope.index, $scope.questionB.Style, option);
        }
        var nextIndex = Number($scope.index) +1;
        if(nextIndex>30)
        {
            var answersDict = AnswersService.getAnswers();
            answersDict["userID"] = $window.localStorage['userID'];
            var date = new Date();
            answersDict["createDate"] = date.toUTCString();
            ServerAnswersModel.create(answersDict, $window.localStorage['token'])
            .then(function(response) {
                if (response.status === 200) {
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    $state.go('test.results');
                } else {
                    // invalid response
                }
            }, function(response) {
                // something went wrong
                console.log(response);
            });
        }else {
            $state.go('test.detail',{testID:nextIndex});
        }
    };
    
    $scope.goBack = function ()
    {
        AnswersService.eraseLastAnswer();
        $ionicHistory.goBack();
    };
})

.controller('RegisterCtrl', function($scope, $state, UserModel, $ionicNavBarDelegate, $window, $ionicHistory) {
    
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
                    $window.localStorage["userID"] = response.data.id;
                    console.log(response);
                    loginAfterRegister();
                } else {
                    // invalid response
                }
            }, function(response) {
                // something went wrong
                console.log(response);
            });
        }
    };
    
    //Required to get the access token
    function loginAfterRegister()
    {
        UserModel.login($scope.user)
        .then(function(response) {
            if (response.status === 200) {
                //Should return a token
                $window.localStorage['token'] = response.data.id;
                    $ionicHistory.nextViewOptions({
                      historyRoot: true,
                      disableBack: true
                    });
                $state.go('test.lobby');
            } else {
                // invalid response
            }

        }, function(response) {
            // something went wrong
            console.log(response);
            console.log(response.status);
            //alert("Incorrect username or password");
        });
    }
})

.controller('LoginCtrl', function($scope, $window , $state, UserModel, $ionicNavBarDelegate, $ionicHistory) {
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
                    console.log(response);
                    $window.localStorage['userID'] = response.data.userId;
                    $window.localStorage['token'] = response.data.id;
                        $ionicHistory.nextViewOptions({
                          historyRoot: true,
                          disableBack: true
                        });
                    $state.go('test.lobby');
                } else {
                    // invalid response
                }
    
            }, function(response) {
                // something went wrong
                console.log(response);
                console.log(response.status);
                alert("Incorrect username or password");
            });
        }
    };
})

.controller('LobbyCtrl', function($scope, $window, $ionicHistory, $ionicNavBarDelegate, $state, ServerQuestionModel, QuestionModel, UserModel) {
    $scope.user = {};
    $ionicHistory.clearHistory();
    $ionicNavBarDelegate.showBackButton(false);
    
    ServerQuestionModel.all($window.localStorage['token'])
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
        delete $window.localStorage['userID'];
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
})
.controller('ResultsCtrl', function($scope, AnswersService, $ionicHistory) {
    
    var answersInfo = AnswersService.getAnswers();
    
    $scope.dashboardButtonTapped = function()
    {
        $ionicHistory.goToHistoryRoot($ionicHistory.currentView().historyId);
    };
    
    $scope.labels = ["Competing", "Collaborating", "Compromising", "Avoiding", "Accommodating"];
    $scope.data = [[returnPercentage(answersInfo["competing"]), returnPercentage(answersInfo["collaborating"]), 
        returnPercentage(answersInfo["compromising"]), returnPercentage(answersInfo["avoiding"]), returnPercentage(answersInfo["accommodating"])]];
    $scope.options = {
        scaleIntegersOnly: true,
        animation: false,
        responsive:true,
        maintainAspectRatio: false,

        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 25,
        scaleStartValue: 0,
        scaleLabel: "<%=value%>"+"%",
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(0) %>"+"%",
        };
    $scope.colours = [{
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(15,187,25,1)",
                    pointColor: "rgba(15,187,25,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,0.8)"
                }];
    
    function returnPercentage (value)
    {
        return (value/12)*100;
    }

})
.controller('HistoryCtrl', function($scope, ServerAnswersModel, $window, $ionicHistory) {
    $scope.answers = [];
   ServerAnswersModel.all($window.localStorage['userID'], $window.localStorage['token'])
    .then(function(response) {
        console.log(response);
        if (response.status === 200) {
            //Should return a token
            $scope.answers = response.data;
            
        } else {
            // invalid response
        }

    }, function(response) {
        // something went wrong
        console.log(response);
        console.log(response.status);
    });
    
    $scope.goBack = function ()
    {
        $ionicHistory.goBack();
    };
});