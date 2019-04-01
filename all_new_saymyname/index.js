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
            SKILL_NAME: 'Say My Name',
            GET_NAME: "What is your name? ",
            SAY_HI_1: "Hello ",
            SAY_HI_2: "Nice to meet you.", 
            CARD_CONTENT: "Your name is: ",
            HELP_MESSAGE: 'I can say your name - not very helpful. I know. Just tell me you name! ',
            HELP_REPROMPT: 'What is you name? ',
            STOP_MESSAGE: 'Goodbye!'
        }
    }
};

function sayUserName(inst,userName){
    
    const speechOutput = inst.t('SAY_HI_1') + userName + '! ' + inst.t('SAY_HI_2');
    const cardTitle = inst.t('SKILL_NAME');
    const cardContent = inst.t('CARD_CONTENT') + userName;
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
        'sayMyName': function () {
            if(this.attributes['userName']){
                sayUserName(this,this.attributes['userName']);
            } else {
                this.emit(':ask',this.t('GET_NAME'));
            }
        },
        'myNameIs': function () {
            const userName = event.request.intent.slots.name.value;
            this.attributes['userName'] = userName;
            sayUserName(this,userName);
        },
        'nameOrigin': function () {
            
            const reqName = event.request.intent.slots.name.value;
            // DEFINE JSON REQUEST
            const params = {
              "RequestItems": {
                 "nameorigins": {
                "Keys": [
                 {"name": {
                    "S": reqName
                   }
                 }
                ]
               }  
              }
             };
            // GET THE REQUESTED ORIGIN
            const thisSession = this;
            dynamoDB.batchGetItem(params,function(err,data){
                if(err){
                    console.log(err);
                }else{
                    thisSession.emit(':tell',data.Responses.nameorigins[0].origin.S);
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
    alexa.dynamoDBTableName = 'saymyname';
    alexa.resources = languageStrings;
    alexa.registerHandlers(buildHandlers(event));
    alexa.execute();
};