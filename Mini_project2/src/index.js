var Alexa = require('alexa-sdk');
var Data = require("./data");
var skillName = "The Polyglot";
var handlers = {
    "LanguageIntent": function () {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        var speechOutput = "";
        speechOutput = "I don't have anything interesting to share regarding what you've asked.";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },
    "AboutIntent": function () {
        var speechOutput = "The Polyglot Developer, Nic Raboy, is from San Francisco, California";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },
    "AMAZON.HelpIntent": function () {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "Tell me something interesting about Java. ";
        speechOutput += "Tell me about the skill developer. ";
        speechOutput += "You can also say stop if you're done. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
    "LaunchRequest": function () {
        var speechText = "";
        speechText += "Welcome to " + skillName + ". ";
        speechText += "You can ask a question like, tell me something interesting about Java. ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);
    }
};
exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.echo-sdk-ams.app.APP_ID";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
