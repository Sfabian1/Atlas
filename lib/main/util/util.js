const short = require('short-uuid');
const translator = short("0123456789",{
    consistentLength: true,
    
  });

const generateShortUUID = () => {
    return Number(String(translator.new()).slice(0,17));
}

const isGet = (url) => {

    return url.split('/').length == 4;
}

module.exports = {
    generateShortUUID,
    isGet
}
