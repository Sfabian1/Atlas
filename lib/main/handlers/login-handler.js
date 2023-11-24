const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');
const genUUID = require('../util/util.js');
const ErrorHandler = require('../util/error-handler.js')
const { InternalServerException, ValidationException } = require('../util/exceptions.js');
const { setClientToken, insertTokenIntoCache , tokenCache} = require('../constants/server-constants');

const { 
    CompletedResponse
} = require('../util/response.js');

const SALT_ROUNDS = 10;

class LoginHandler extends Handler{

    async handle(req) {
        try {
            switch (req.url) {
                case('/login/signup'):
                    try {
                        return this.processhandleSignup(req);
                    } catch (error) {
                        return ErrorHandler.handleError(error);
                    }
                case('/login/login'): 
                    try {
                        return this.processhandleLogin(req);
                    } catch (error) {
                        return ErrorHandler.handleError(error);
                    }
            }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
        
    }

    async handleSignup() {
        try {

            var req_body = JSON.parse(this.postValue);
            const username = req_body.username;
            const password = req_body.password;

            if (!username || !password) {
                throw new ValidationException("Username and password are required");
            }

            const connectionDB = await db.connection;
            const queryCheck = `SELECT * FROM users WHERE username = '${username}'`;

            const userExists = await new Promise((resolve, reject) => {
                connectionDB.query(queryCheck, function (err, result) {
                    if (err) reject(new InternalServerException(err));
                    resolve(result.length > 0);
                });
            });

            if (userExists) {
                throw new ValidationException("User already exists");
            } else {
                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                const userID = genUUID.generateShortUUID();
                const queryInsert = `INSERT INTO users (username, password, userID) VALUES ('${username}', '${hashedPassword}', '${userID}')`;

                await new Promise((resolve, reject) => {
                    connectionDB.query(queryInsert, function (err, result) {
                        if (err) reject(new InternalServerException(err));
                        resolve(result);
                    });
                });

                return new CompletedResponse(String(userID), 'text/plain');
            }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }

    async handleLogin() {
        try {
            var req_body = JSON.parse(this.postValue);

            const username = req_body.username;
            const password = req_body.password;
            if (!username || !password) {
                throw new ValidationException("Username and password are required");
            }

            const connectionDB = await db.connection;
            const queryCheck = `SELECT * FROM users WHERE username = '${username}'`;

            const result = await new Promise((resolve, reject) => {
                connectionDB.query(queryCheck, function (err, result) {
                    if (err) reject(new InternalServerException(err));
                    resolve(result);
                });
            });

            if (result.length > 0) {
                const user = result[0];
                
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const secClientToken = this.generateSecureToken(32);
                    setClientToken(secClientToken);
                    
                    insertTokenIntoCache(user.userID, secClientToken);
                    return new CompletedResponse("Successfully Logged In", 'text/plain');
                    
                } else {
                    throw new ValidationException("Invalid password");
                }
            } else {
                throw new ValidationException("User does not exist");
            }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }

    async processhandleSignup(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.handleSignup();
    }

    async processhandleLogin(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.handleLogin();
    }

    async generateSecureToken(length) {
        return crypto.randomBytes(length).toString('hex');
    }
    
}

module.exports = { LoginHandler };
