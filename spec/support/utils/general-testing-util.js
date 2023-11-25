const generateRandomString = (size) => {
    let result = '';
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = chars.length;
    for (let index = 0; index < size; index++) {
        result += chars.charAt(Math.random() * length);
    }
    return result;
}

const generateWholeRandomNumber =  (start, end)  => {
    return Math.floor(start + (Math.random() * end));
}

const generateRandomEnumValue = (enumList) => {
    return enumList[(Math.floor(Math.random() * enumList.length))];
}


module.exports = {
    generateRandomString: generateRandomString,
    generateWholeRandomNumber: generateWholeRandomNumber,
    generateRandomEnumValue: generateRandomEnumValue
}