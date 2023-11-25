const short = require('short-uuid');
const {idRegex}= require("../constants/server-constants");
const { ValidationException } = require('./exceptions');
const translator = short("123456789",{
    consistentLength: true,
    
  });

const generateShortUUID = () => {
    return Number(String(translator.new()).slice(0,17));
}

const isGet = (url) => {

    return url.split('/').length == 4;
}

const getUserID = (url) => {
    return url.split('/')[1];
}

const getTypeID = (url) => {
    return url.split('/')[3];
}

const validateAndConvertId = (id) => {
    if(id.match(idRegex))
        return Number(id);
    throw new ValidationException(`Id ${id} is not valid id`);
}

const getURLParameters = (url, parameter) => {
    let params = new URLSearchParams(url.split("?")[1]);
    // console.log(params);
    if(params.size == 0)
        throw new ValidationException(`No parameters in url expected URLs to contain parameters`);
    
    return params.get(parameter)
}

module.exports = {
    generateShortUUID,
    isGet,
    getUserID,
    getTypeID,
    getURLParameters,
    validateAndConvertId
}
