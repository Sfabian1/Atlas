const short = require('short-uuid');
const translator = short("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",{
    consistentLength: true,
  });

const generateShortUUID = () => {
    return translator.new();
}

module.exports = {
    generateShortUUID
}