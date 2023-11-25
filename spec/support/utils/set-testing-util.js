const enums = require("../../../lib/main/constants/enumConstants.js");
const { MOMENT_DATE_FORMAT } = require("../../../lib/main/constants/server-constants.js");
const { generateShortUUID } = require("../../../lib/main/util/util.js");
const { generateWholeRandomNumber, generateRandomEnumValue , generateRandomString} = require("./general-testing-util.js");
const moment = require('moment');

const generateRandomSet= (userId, exerciseId, setId, workoutId , date, time_start, time_end) => {
    let weight_metric = generateRandomEnumValue(enums.enumList.weightMetricEnum);
    let difficulty = generateRandomEnumValue(enums.enumList.difficultyEnum);
    let distance_metric = generateRandomEnumValue(enums.enumList.distanceMetricEnum);
    const rawSetString = `{\"exerciseID\":\"${exerciseId}\",`
    + `\"userID\":\"${userId}\",`
    + `\"setID\":\"${setId}\",`
    + `\"workoutID\":\"${workoutId}\",`
    + `\"Date\":\"${date}\",`
    + `\"num_of_times\":\"`+ generateWholeRandomNumber(0,50) + `\",`
    + `\"weight\":\"`+ generateWholeRandomNumber(0,500) + `\",`   
    + `\"weight_metric\":\"${weight_metric}\",`
    + `\"distance\":\"`+ generateWholeRandomNumber(0,500) + `\",`   
    + `\"distance_metric\":\"${distance_metric}\",`
    + `\"rep_time\":\"`+ generateWholeRandomNumber(22) + `\",`
    + `\"difficulty\":\"${difficulty}\",`
    + `\"time_start\":\"${time_start}\",`
    + `\"time_end\":\"${time_end}\"}`
					
    return  JSON.parse(rawSetString);
}

//console.log(generateRandomSet(generateShortUUID(), generateShortUUID(), generateShortUUID(), generateShortUUID(), "9/20/2023", "01:01:01","02:02:02"));

module.exports = {
    generateRandomSet
}