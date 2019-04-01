'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
const APP_ID = '';  // TODO replace with your app ID.
var idx=0;
var cnt=0;
var point=0;
var correct=0;

const languageStrings = {
    'en': {
        translation: {
            GREETING: [
                'Hello. How may I help? ',
                'Hi. What can I do for you? '
            ],
            Questions: [
               [ 'Albert Einstein was awarded Nobel Prize for his path-breaking research and formulation of the: .... 1 Theory of Relavitity .... 2  Laws of Photo-Electric Effect ......3 Principle of Wave-Particle Duality ....4 Theory of Critical Opalescence',
                'Which one of the following types of Laser is used in Laser Printers? [1] Semiconductor laser [2] Excimer Laser [3] Dye Laser [4] Gas Laser'
               ],
               [ 'The power of a lens is measured in : [A] diopters [B] aeon [C] lumen [D] candela ',
                'Two Flat mirrors are placed at an angle of 60° from each other. How many images will be formed of a Candle placed in between them? [A] 3 [B] 4 [C] 5 [D] 6 '
                ],
                ['Who was the father of computer? ........ [1]  Charlie Babbage    [2] Dennis Ritchie    [3]   Charles Babbage   [4]   Ken Thompson',
                'Who was the father of computer? ........ options are     [1]  Charlie Babbage    [2] Dennis Ritchie    [3]   Charles Babbage   [4]   Ken Thompson',
                'What is the full form of CPU?........ options are     [1]Central Process Unit  [2]Central Processing Unit   [3]Central Programming Unit   [4]Central Progressive Unit'
                ],
                ['What is the full form of CU?........ options are      [1]Compound Unit    [2]Communication Unit  [3]Computer Unit   [4]Control Unit',
                'What is the full form of ALU?........ options are       [1]Arithmetic Logic Unit [2]Arithmetic Local Unit    [3]Advance Logical Unit    [4]None of these',
                'What is the full form of MU?........ options are       [1]Management Unit     [2]Masked Unit   [3]Main Unit    [4]Memory Unit'
                ],
                ['What is the full form of EEPROM?........ options are       [1]Electrically Erasable Read Access Memory   [2]Electrically Erasable Read Only Memory    [3]Ethical Electrically Read Only Memory    [4]None of these',
                'What is the full form of SDRAM?........ options are       [1]Special Dynamic Read Access Memory    [2]Synchronous Dynamic Read Access Memory     [3]Special Dynamic Random Access Memory    [4]Synchronous Dynamic Random Access Memory',
                'Which electronics component is used in first generation computers?........ options are       [1]Transistors [2]ULSI Chips  [3]Vacuum Tubes  [4]LSI Chips'

                ],
                ['Which is not a correct type of a computer?........ options are         [1]Mini Frame Computer  [2]Super Computer   [3]Workstations [4]Personal Computer',
                'Which part of the computer is considered as Brain of the Computer?........ options are          [1]Random Access Memory [2]Central Process Unit [3]Read Only Memory [4]Hard Disk',
                'What is the full form of OCR?........ options are       [1]Optical Character Reader [2]Optical Central Reader   [3]Optimized Character Reader   [4]Optical Character Response'
                ],
                ['What is the full form of MICR?........ options are       [1]Magnetic Inkjet Character Reader   [2]Magnetic Isolated Character Responsive   [3]Magnetic Ink Character Reader    [4]Magnetic Isolated Character Responsive',
                'What is the full form of OCR?........ options are       [1]Optimized Character Reader   [2]Optical Character Reader [3]Optical Centre Reader    [4]None of these',
                'Why OMR is used?........ options are       [1]Scan mails    [2]Scan images  [3]Scan documents   [4]Scan answer sheets'
                ],
                ['Which input device is used to scan cheque in banks?........ options are       [1]OCR   [2]MIC  R[3]OMR [4]All of the above',
                'Daisy Wheel term belongs to?........ options are       [1]Printer   [2]Plotter  [3]Monitor  [4]Scanner',
                'Which can be the input and output devices both?........ options are       [1]Scanner    [2]Touch screen monitor [3]Speaker  [4]Digitizer'
                ],
                ['Which is not a valid type of printer?........ options are       [1]Dot matrix  [2]Daisy wheel  [3]OCR  [4]Inkjet',
                'Impact and Non Impact are related to?........ options are           [1]Scanners [2]Printers [3]Keyboards    [4]Monitors',
                'What is the full form of MROM?........ options are       [1]Masked Read Only Memory [2]Main Read Only Memory    [3]Magnetic Read Only Memory    [4]None of these'
                ],
                ['What is the full form of PCB?........ options are       [1]Printed Circuit Board   [2]Processing Central Board [3]Peripherals Combined Board   [4]None of these',
                'Which is the smallest memory measurement unit in given options?........ options are       [1]Byte   [2]Micro Byte   [3]Kilo Byte    [4]Nibble',
                'In computer memory measurement units, PT stands for?........ options are       [1]Perabyte  [2]Pexabyte [3]Petabyte [4]None of these'
                ],
                ['One GB (Gega Byte) contains --- bytes?........ options are       [1]1073741824 [2]1048576  [3]83886808 [4]8192',
                '1024 Bytes equivalent to?........ options are       [1]213  [2]212  [3]211  [4]210',
                'What is the full form of USB?........ options are       [1]Unique Synchronised Bus  [2]Universal Synchronised Bus   [3]Universal Serial Bus [4]Unlimited Sending Buffer'
                ],
                ['What is the full form of VGA?........ options are       [1]Video Graphics Array    [2]Video Graphical Accelerator  [3]Visual Graphics Array    [4]Visual Graphical Accelerator',
                  'What is the full form of Modem?........ options are       [1]Modulator-Demo [2]Modules-De Modules   [3]Modulator-Demodulator    [4]None of these',
                'What does an Operating System do?........ options are       [1]Memory Management    [2]File Management  [3]Application Management   [4]All of the above'
                ],
                ['An Operating System is a type of?........ options are       [1]Application Software    [2]System Software  [3]Utility Program  [4]None of these',
                'Which is not an Operating System?........ options are       [1]Windows  [2]Macintosh    [3]Linux    [4]Open Office',
                'Where an Operating System keeps the information of files?........ options are       [1]FAT – File Allocation Table  [2]FFT – File Folder Table  [3]FIT – File Index Table   [4]DIT – Directory Index Table'
                ],
                ['Which type of operating system process data at actual time?........ options are       [1]Batch processing operating system [2]Time sharing operating system    [3]Instant response operating system    [4]Real time operating system',
                'Which is the most suitable scheduling scheme in real time operating systems?........ options are       [1]Preemitive Scheduling Scheme  [2]Random Scheduling Scheme [3]Round Robin Scheduling Scheme    [4]None of these',
                'Fedora is a flavour of --- Operating System?........ options are       [1]Unix  [2]Macintosh    [3]Windows  [4]Linux'
                ],
                ['What is an Internet?........ options are       [1]Network of Network   [2]Wide Area Network    [3]Interconnected computers from the world  [4]All of the above',
                'What is the full form of WWW?........ options are       [1]World Wide Web   [2]World Wide Wave  [3]World Web Websites   [4]None of these',
                'What is the full form of LAN?........ options are       [1]Local Access Network [2]Local Area Network   [3]Local Accelerator Network    [4]Logical Area Network'
                ],
                  ['What is the full form of MAN?........ options are       [1]Metropolitan Area Network [2]Medium Area Network  [3]Main Area Network    [4]Masked Area Network',
                'What is the full form of WAN?........ options are       [1]World Area Network   [2]Websites Area Network    [3]Wide Area Network    [4]Wave Area Network',
                'What is the full form of PAN?........ options are       [1]Permanent Area Network   [2]Posted Area Network  [3]Passive Access Network   [4]Personal Area Network'
                ],
                ['What is an Intranet?........ options are       [1]A local area network [2]A metropolitan area network  [3]A wide area network  [4]None of these',
                'What is the full form of IP?........ options are       [1]Internet Progress [2]Internet Protocol    [3]Internet Pass    [4]Internet Password',
                'What is the full form of TCP?........ options are       [1]Transmission Control Protocol    [2]Transmission Communication Protocol  [3]Transformation Control Protocol  [4]Transmission Central Pass]'
                ]

],
            ans: [
                [ '2',
                  '1'
                ],
                [  '1',
                  '3'
                ],
                ['3',
                  '3',
                  '2'
                ],
                  ['4',
                  '1',
                  '4'
                  ],

                  ['2',
                   '4',
                  '3'
                  ],

                  ['1',
                    '2',
                  '1'
                  ],
                  [ '3',
                    '2',
                  '4'
                  ]

                  ['2',
                   '1',
                  '2'
                  ],

                  ['3',
                    '2',
                  '1'
                  ],

                  ['1',
                    '4',
                  '3'
                  ],

                  ['1',
                   '4',
                  '3'
                  ],

                  ['1',
                    '3',
                  '4'
                  ],

                  ['2',
                   '4',
                  '1'
                  ],

                  ['4',
                   '1',
                  '4'
                  ],

                  ['4',
                  '1',
                  '2'
                  ],
                  
                  ['1',
                  '3',
                  '4'],

                  ['1',
                   '2',
                  '1'
                  ]

            ],
             ans_speak: [
                [ 'Laws of Photo-Electric Effect',
                  'Semiconductor laser'
                ],
                [
                  'diopters',
                  '5'
                ],
                ['Charles Babbage ',
                'Charles Babbage ',
                'Central Processing Unit '
                ],
                ['Control Unit ',
                'Arithmetic Logic  ',
                'Memory Unit  '
                ],
                ['Electrically Erasable  ',
                'Synchronous Dynamic Random Access ',
                'Vacuum Tubes   '
                ],
                ['Mini Frame Computer  ',
                'Central Process Unit ',
                'Optical Character Reader  '
                ],
                ['Magnetic Ink ',
                'Optical Character Reader',
                ' Scan answer sheets'
                ],
                ['MICR ',
                'Printer',
                'Touch'
                ],
                [' OCR ',
                'Printers',
                'Masked Read Only Memory '
                ],
                
                ['Printed Circuit Board   ',
                'Nibble ',
                'Petabyte   '
                ],
                
                ['1073741824  ',
                '2 to the power 10  ',
                'Universal Serial Bus  '
                ],
                ['Video Graphics Array ',
                'Modulator-Demodulator ',
                'All of the above '
                ],
                ['System Software ',
                ' Open Office ',
                'FAT – File Allocation Table '
                ],
                ['Real time operating system ',
                'Preemitive Scheduling Scheme ',
                'Linux  '
                ],
                ['All of the above  ',
                'World Wide Web  ',
                'Local Area Network '
                ],
                ['Metropolitan Area Network ',
                'Wide Area Network  ',
                'Personal Area Network  '
                ],
                ['A local area network  ',
                ' Internet Protocol ',
                'Transmission Control Protocol  '
                ]

            ],
             
             Questions3: [
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

function AskQuestions1(inst){
   
     const Q=inst.t('Questions');
     const Questions = Q[0];
    const Questions1Idx = Math.floor(Math.random() * Questions.length);
    idx=Questions1Idx;
    const speechOutput = Questions[Questions1Idx];
    const cardTitle = inst.t('SKILL_NAME');
    const cardContent = inst.t('CARD_CONTENT');
    const imageObject = {
                            "smallImageUrl": "https://s3.amazonaws.com/alexa-say-my...",
                            "largeImageUrl": "https://s3.amazonaws.com/alexa-say-my..."
                        };
    inst.emit(':ask', speechOutput);
    
}
function AskQuestions2(inst,speech1,q){
   
     const Q=inst.t('Questions');
     const Questions = Q[q];
     const Questions1Idx = Math.floor(Math.random() * Questions.length);
    idx=Questions1Idx;
    const speechOutput = speech1+'  .........  next Questions is ......... '+Questions[Questions1Idx];
    const cardTitle = inst.t('SKILL_NAME');
    const cardContent = inst.t('CARD_CONTENT');
    const imageObject = {
                            "smallImageUrl": "https://s3.amazonaws.com/alexa-say-my...",
                            "largeImageUrl": "https://s3.amazonaws.com/alexa-say-my..."
                        };
                cnt++;
    inst.emit(':ask', speechOutput);
}
function end_game(inst){
   
    const speechOutput = 'Thanks for playing quiz game your score is .....  '+point+'    you give   '+correct+'   correct  answer out of.....'+cnt;
      const cardTitle = inst.t('SKILL_NAME');
    const cardContent = inst.t('CARD_CONTENT');
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
            AskQuestions1(this);
         
           
        },
  
        'getAns': function () {
            const ans = event.request.intent.slots.option.value;
            const A=this.t('ans');
            const ansArray=A[cnt];
            var new_stage='';
            if(cnt==5){
                new_stage='     you successfully  complete level 1....    ';
            }
            if(cnt==10){
                new_stage='     you successfully complete level 2....    ';
            }
            if(cnt==15){
                new_stage='         you successfully complete level 3....    ';
            }
            
            else if(ans==ansArray[idx]){
                const speech='Congratulations ........it\'s   a       Right answer    '+new_stage;
                point+=5;
                correct++;
                        AskQuestions2(this,speech,cnt+1);
                    if(cnt==16){
                end_game(this);          
            }
            }
            else{
          const AS=this.t('ans_speak');
            const ans_speak=AS[cnt];
        
                const speech='it\'s   a... Wrong answer right answer  is '+ansArray[idx]+'  ........   '+ans_speak[idx]+'     '+new_stage;
                  AskQuestions2(this,speech,cnt+1);
                if(cnt==16){
                end_game(this);          
            }
            }
            
   
        },
         'Quit_game': function () {
   
            end_game(this); 
           
        },      
        'AMAZON.HelpIntent': function () {
        //    console.log(“THIS.EVENT = “ + JSON.stringify(this.event));
            const speechOutput = this.t('HELP_MESSAGE');
            
            this.emit(':tell', this.t('STOP_MESSAGE'));
        },
        'AMAZON.StopIntent': function () {
         //   console.log(SON.stringify(this.event));
            this.emit(':tell', th2s.t(',speechSTOP_MESSAGE'));
        }
    };
    
    return handlers;
    
}


exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(buildHandlers(event));
    alexa.execute();
};