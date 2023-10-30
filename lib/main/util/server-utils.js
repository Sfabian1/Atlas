const { acceptableHeaderTypes } = require("../constants/server-constants");
const { ValidationException } = require("./exceptions");
acceptableHeaderTypes

const validateHeaderType = (req) => {
    let headerType = req.headers['content-type'];
    if(!acceptableHeaderTypes.includes(headerType))
        throw new ValidationException(`Unsupported header-type ${headerType}`);
}


module.exports = {
    validateHeaderType
}