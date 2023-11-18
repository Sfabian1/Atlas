const{ ValidationException
} = require("../util/exceptions.js");

const enumList = {

"moodEnum": ['worst', 'worse', 'normal', 'better', 'best'],
"stressEnum":['extreme', 'high', 'moderate', 'mild', 'relaxed'],
"sleepEnum": ['terrible', 'poor', 'fair', 'good', 'excellent'],
"motivationEnum":['lowest', 'lower', 'normal', 'higher', 'highest'],
"hydrationEnum":['brown', 'orange', 'yellow', 'light', 'clear'],
"sorenessEnum":['severe', 'strong', 'moderate', 'mild', 'none'],
"difficultyEnum":['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'],
"statusEnum": ['IN_PROGRESS', 'COMPLETED', 'STARTED'],
"targetMuscleEnum": [
    'abdominals',
    'biceps',
    'calves',
    'chest',
    'forearm',
    'glutes',
    'grip',
    'hamstrings',
    'hips',
    'lats',
    'lower_back',
    'middle_back',
    'neck',
    'quadriceps',
    'shoulders',
    'triceps'
],

"forceEnum":['push', 'pull'],
"progressionEnum": ['weight', 'reps', 'time', 'distance'],
"weightMetricEnum":['lbs', 'kg', 'ton', 'tonne'],
"distanceMetricEnum": ['feet', 'yards', 'miles', 'meters', 'kilometers'],
"setsDifficultyEnum":['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'],

};

const moment = require('moment');

function isValidDateFormat(date) {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }


 function isValidTimeFormat(time){

    
    const timeFormatRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;     
    return timeFormatRegex.test(time);
  };


 function isValidEnumValue(enumName, reqInput, isCreate){
    console.log("reqInput : "+ " " + reqInput)
    if(reqInput == undefined){
        console.log("isCreate" + " " + isCreate)
        if(isCreate == true){
            throw new ValidationException("Error");
        }
        return;
    }
     console.log(reqInput + " after second if");
    if (!enumList[enumName].includes(reqInput)){
        throw new ValidationException(`Invalid enum field ${enumName} with value ${reqInput}` ) ;
        }
 }
 


module.exports = { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat};
