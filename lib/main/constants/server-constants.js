const textHeader = "text/plain";
const jsonHeader = "application/json";
const acceptableHeaderTypes = [textHeader, jsonHeader];
const exercisePathRegex = /^[/][a-zA-Z0-9]*[/]exercise{1}[/]?[a-zA-Z0-9]*$/gm;
const workoutPathRegex = /^[/][a-zA-Z0-9]*[/]workouts{1}[/]?[a-zA-Z0-9]*$/gm;
const profilePathRegex = /^[/][a-zA-Z0-9]*[/]profile{1}[/]?[a-zA-Z0-9]*$/gm;
const setPathRegex = /^[/][a-zA-Z0-9]*[/]sets{1}[/]?[a-zA-Z0-9]*$/gm;
const wellnessPathRegex = /^[/][a-zA-Z0-9]*[/]wellness{1}[/]?[a-zA-Z0-9]*$/gm;
const plotPathRegex = /^[\/][a-zA-Z0-9]*[\/]plot{1}[?]{1}.*$/gm;
const idRegex = /^[0-9]{17}$/gm;
const MOMENT_DATE_FORMAT = "YYYY-MM-DD";

let clienttoken = "00000000000000000000";
const tokenCache = {};

const setClientToken = (newToken) => {
    clienttoken = newToken;
};

const getClientToken = () => {
    return clienttoken;
};

// Function to insert token into the cache
const insertTokenIntoCache = (userID, token) => {
    tokenCache[userID] = token;
};

// Function to get token from the cache
const getTokenFromCache = (userID) => {
    return tokenCache[userID];
};



module.exports = {
    textHeader,
    jsonHeader,
    acceptableHeaderTypes,
    exercisePathRegex,
    wellnessPathRegex,
    workoutPathRegex,
    setPathRegex,
    profilePathRegex,
    idRegex,
    clienttoken,
    setClientToken,
    getClientToken,
    insertTokenIntoCache,
    getTokenFromCache,
    tokenCache,
    plotPathRegex,
    MOMENT_DATE_FORMAT
}
