angular.module('SSFServices', [])
.service('QuestionModel', function () {
    var service = this;
    var questions = [];
    
    service.setQuestions = function(serverQuestions)
    {
        questions = serverQuestions;
    };
    
    service.getQuestion = function(questionID)
    {
        var results = [];
        questions.forEach(function(question){
            //Search for questions with the specified question ID
            if(question.Question_Number == questionID)
                results.push(question);
        }); 
        return results;
    };
})

.service('AnswersService', function () {
    var service = this;
    var answerTypes = {
        "competing": 0,
        "collaborating": 0,
        "compromising": 0,
        "avoiding": 0,
        "accommodating": 0
    };
    var answers = {};
    var lastAnswer = "";
    service.saveAnswer = function(questionNumber, questionType, option)
    {
        switch (questionType) {
            case "Competing":
                answerTypes["competing"]++;
                break;
            case "Collaborating":
                answerTypes["collaborating"]++;
                break;
            case "Compromising":
                answerTypes["compromising"]++;
                break;
            case "Avoiding":
                answerTypes["avoiding"]++;
                break;
            case "Accommodating":
                answerTypes["accommodating"]++;
                break;
            default:
        }
        answers[questionNumber] = option;
        lastAnswer = questionType;
    };
    
    service.getAnswers = function()
    {
        return answerTypes;
    };
    
    service.setAnswers = function(answers)
    {
        answerTypes = answers;
    };
    
    service.eraseLastAnswer = function()
    {
        answerTypes[lastAnswer.toLowerCase()]--;
    };
});