const enums = require("../../../lib/main/constants/enumConstants.js");
//const { generateShortUUID } = require("../../../lib/main/util/util.js");
const { generateRandomString, generateWholeRandomNumber, generateRandomEnumValue } = require("./general-testing-util.js");

function generateRandomRestInterval() {
    return generateWholeRandomNumber(0,12) + ":" + generateWholeRandomNumber(0,59) + ":" + generateWholeRandomNumber(0,59) ;
}


const generateRandomExercise = (userId, exerciseId) => {
    let name = generateRandomString(6);
    let force = generateRandomEnumValue(enums.enumList.forceEnum);
    let muscleGroup = generateRandomEnumValue(enums.enumList.targetMuscleEnum);
    let progression = generateRandomEnumValue(enums.enumList.progressionEnum);
    let rest_interval = generateRandomRestInterval();
    let link = "http://www." + generateRandomString(6) + ".com";


    const rawExerciseString = `{\"name\":\"${name}\",` 
    + `\"forces\":\"${force}\",`
    + `\"userId\":\"${userId}\",`
    + `\"exerciseId\":\"${exerciseId}\",`
    + `\"target_muscle_group\":\"${muscleGroup}\",`
    + `\"progression\":\"${progression}\",`
    + `\"link\":\"${link}\",`
    + `\"rest_interval\":\"${rest_interval}\"}`

    return  JSON.parse(rawExerciseString);
}

// Testing console.log(generateRandomExercise(generateShortUUID(), generateShortUUID()))

module.exports = {
    generateRandomExercise
}