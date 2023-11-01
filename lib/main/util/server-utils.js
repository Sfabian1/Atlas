const { acceptableHeaderTypes, exercisePathRegex, setPathRegex, workoutPathRegex,
     profilePathRegex, wellnessPathRegex}= require("../constants/server-constants");
const { SetHandler } = require("../handlers/set-handler");
const { ValidationException } = require("./exceptions");



const validateHeaderType = (req) => {
    let headerType = req.headers['content-type'];
    if(!acceptableHeaderTypes.includes(headerType))
        throw new ValidationException(`Unsupported header-type ${headerType}`);
}

const selectHandler = (url) => {
    if (url == null)
        throw new ValidationException("request url is null");
    console.log(`Url:${url}`);
    console.log(typeof url);
    if (url.match(exercisePathRegex)){
        console.log("Using exercise handler for this  request")
        return new SetHandler();
    } else if (url.match(setPathRegex)) {
        console.log("Using set handler for this  request")
        return new SetHandler();
    } else if (url.match(workoutPathRegex)) {
        console.log("Using workout handler for this  request")
        return new SetHandler();
    } else if (url.match(profilePathRegex)) {
        console.log("Using profile handler for this  request")
        return new SetHandler();
    } else if (url.match(wellnessPathRegex)) {
        console.log("Using wellness handler for this  request")
        return new SetHandler();
    }
    throw new ValidationException(`Unable to serve request, malformed url ${url}`);
}


module.exports = {
    validateHeaderType,
    selectHandler
}