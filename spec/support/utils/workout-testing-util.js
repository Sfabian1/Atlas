const enums = require("../../../lib/main/constants/enumConstants.js");
const { generateRandomString, generateRandomEnumValue } = require("./general-testing-util.js");
const generateRandomWorkout = (status, date, timeStart, timeEnd, difficulty = null, shouldParse = true) => {
    let name = generateRandomString(10)
    difficulty = difficulty == null ? generateRandomEnumValue(enums.enumList.difficultyEnum): difficulty
    const rawWorkoutString = `{\"name\": \"${name}\",`
    + `\"difficulty\": \"${difficulty}\",`
    + `\"timeStart\": \"${timeStart}\",`
    + `\"timeEnd\": \"${timeEnd}\",`
    + `\"date\": \"${date}\",`
    + `\"status\": \"${status}\"\n}`
				
    return  shouldParse ? JSON.parse(rawWorkoutString): rawWorkoutString;
}

//console.log(generateRandomWorkout("IN_PROGRESS","12/02/24","09:02:13","09:03:15"));

module.exports = {
    generateRandomWorkout
}