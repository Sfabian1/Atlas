const enums = require("../../../lib/main/constants/enumConstants.js");
const { MOMENT_DATE_FORMAT } = require("../../../lib/main/constants/server-constants.js");
const { generateShortUUID } = require("../../../lib/main/util/util.js");
const { generateWholeRandomNumber, generateRandomEnumValue , generateRandomString} = require("./general-testing-util.js");
const moment = require('moment');

const generateRandomWellness= (userId, wellnessId, date) => {
    let mood = generateRandomEnumValue(enums.enumList.moodEnum);
    let stress = generateRandomEnumValue(enums.enumList.stressEnum);
    let sleep = generateRandomEnumValue(enums.enumList.sleepEnum);
    let motivation = generateRandomEnumValue(enums.enumList.motivationEnum);
    let hydration = generateRandomEnumValue(enums.enumList.hydrationEnum);
    let soreness= generateRandomEnumValue(enums.enumList.sorenessEnum);

    const rawSetString = `{\"wellness_id\":\"${wellnessId}\",`
    + `\"user_id\":\"${userId}\",`
    + `\"date\":\"${date}\",`  
    + `\"mood\":\"${mood}\",`
    + `\"sleep\":\"${sleep}\",`   
    + `\"stress\":\"${stress}\",`
    + `\"motivation\":\"${motivation}\",`
    + `\"hydration\":\"${hydration}\",`
    + `\"soreness\":\"${soreness}\"}`
					
    return  JSON.parse(rawSetString);
}

module.exports = {
    generateRandomWellness
}