const short = require('short-uuid');
const translator = short("0123456789",{
    consistentLength: true,
  });

const generateShortUUID = () => {
    return Number(translator.new());
}

module.exports = {
    generateShortUUID
}
