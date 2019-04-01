'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
var dynamoDB = new AWS.DynamoDB();

const APP_ID = '';  // TODO replace with your app ID.

const languageStrings = {
    'en': {
        translation: {
            GREETING: [
                'Hello. How may I help? ',
                'Hi. What can I do for you? '
            ],
            SKILL_NAME: 'Say My Color',
            COLOR: 'your favorite color is ',
            GET_NAME: "What is your name and your favorite color? ",
            SAY_HI_1: "Hello ",
            SAY_HI_2: "Nice to meet you.", 
            CARD_CONTENT: "Your name is: ",
            HELP_MESSAGE: 'I can say your name - not very helpful. I know. Just tell me you name! ',
            HELP_REPROMPT: 'What is you name? ',
            STOP_MESSAGE: 'Goodbye!'
        }
    }
};

function sayUserColor(inst,userName,color){
    
    const speechOutput = inst.t('SAY_HI_1') + userName + '! ' + inst.t('SAY_HI_2') + '! '+inst.t('COLOR')+ color;
    const cardTitle = inst.t('SKILL_NAME');
    const cardContent = inst.t('CARD_CONTENT') + userName+inst.t('COLOR')+color;
    const imageObject = {
                            "smallImageUrl": "https://s3.amazonaws.com/alexa-say-my...",
                            "largeImageUrl": "https://s3.amazonaws.com/alexa-say-my..."
                        };
    inst.emit(':tellWithCard', speechOutput, cardTitle, cardContent, imageObject);
    
}

function buildHandlers(event){
    
    var handlers = {
        'LaunchRequest': function () {
            const greetingArr = this.t('GREETING');
            const greetingIndex = Math.floor(Math.random() * greetingArr.length);
            this.emit(':ask',greetingArr[greetingIndex]);
        },
        'sayMyFavColor': function () {
            
            if(this.attributes['color']){
                sayUserColor(this,this.attributes['userName'],this.attributes['color']);
            } else {
                this.emit(':ask',this.t('GET_NAME'));
            }
        },
        'myNameIs': function () {
            const userName = event.request.intent.slots.name.value;
            const color = event.request.intent.slots.color.value;
            this.attributes['userName'] = userName;
            this.attributes['color'] = color;
            sayUserColor(this,userName,color);
        },
        'nameOrigin': function () {
            
            const reqName = event.request.intent.slots.name.value;
            const reqColor = event.request.intent.slots.color.value;
            // DEFINE JSON REQUEST
            var params = {
                  TableName: 'mycolor',
                  Item: {
                    'userName' : {N: reqName},
                    'color' : {c: reqColor}
                  }
                };
            
            // GET THE REQUESTED ORIGIN
            const thisSession = this;
            dynamoDB.batchGetItem(params,function(err,data){
                if(err){
                    console.log(err);
                }else{
                    thisSession.emit(':tell',data);
                }
            });

        },
        'AMAZON.HelpIntent': function () {
            const speechOutput = this.t('HELP_MESSAGE');
            const reprompt = this.t('HELP_MESSAGE');
            this.emit(':ask', speechOutput, reprompt);
        },
        'AMAZON.CancelIntent': function () {
            this.emit(':tell', this.t('STOP_MESSAGE'));
        },
        'AMAZON.StopIntent': function () {
            this.emit(':tell', this.t('STOP_MESSAGE'));
        }
    };
    
    return handlers;
    
}


exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'mycolor';
    alexa.resources = languageStrings;
    alexa.registerHandlers(buildHandlers(event));
    alexa.execute();
};