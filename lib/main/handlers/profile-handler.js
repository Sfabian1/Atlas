const { Handler } = require("../handlers/handler.js");
const db = require('../util/sqlconnector.js');
const ErrorHandler = require('../util/error-handler.js');
const {genUUID, getUserID, getTypeID} = require('../util/util.js');
const {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    ConflictException
} = require('../util/exceptions.js');

const {
    CompletedResponse
} = require('../util/response.js');

class ProfileHandler extends Handler {

    async handle(req) {
        try {
            await req.on('data', chunk => {super.accumulateChunkData(chunk);});
        	await req.on('end', () => {});
            switch (req.method) {
                case "POST":
                    console.log("USING POST");
                    return this.createProfile(getUserID(req.url));
                case "GET":
                    if (req.url.split('/').filter(Boolean).length == 3) {
                        return this.GetProfile(getUserID(req.url), getTypeID(req.url));
                    } else {
                        return this.ListProfile(getUserID(req.url));
                    }
                case "PUT":
                    return this.UpdateProfile(getUserID(req.url), getTypeID(req.url));
                case "DELETE":
                    return this.DeleteProfile(getUserID(req.url), getTypeID(req.url));
                default:
                    throw new ValidationException("Invalid HTTP method");
            }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    
    #validateJson(key, value) {
        try {
            if (key === "username") {
                return String(value);
            } 
            if (key === "created_at") {
                //const timestamp = new Date(value);
                //if (isNaN(timestamp)) {
                //    throw new Response.ValidationException("Invalid timestamp format");
                
                return timestamp;
            } 
            if (key === "height" || key === "weight" || key === "bmi") {
                return parseFloat(value);
            } 
            if (key === "age") {
                return parseInt(value);
            }
        } 
        catch (err) {
            throw new Response.ValidationException("Error validating profile JSON: " + err);
        }
    }
    
    async GetProfile(userID, profileID) {
        try {
    
            if (!userID || !profileID) {
                throw new ValidationException("Invalid user_id or profile_id");
            }
    
            const connectionDB = await db.connection;
            const query = `SELECT * FROM profile WHERE user_id = '${userID}' AND profile_id = '${profileID}'`;
    
            //var getPromise = await new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                connectionDB.query(query, (err, result) => {
                    if (err) {
                        reject(new InternalServerException(err));
                    }
    
                    if (result && result.length) {
                        console.log("Got result");
                        console.log("Number of results:", result.length);
    
                       if (result.length === 0) {
                          console.log("Unable to find profile with ID", profileID);
                          reject(new ResourceNotFoundException(`Unable to find profile with ID ${profileID}`));
                       } else {
                          var profileData = JSON.stringify(result[0]);
                          console.log('>> string:', profileData);
                          resolve(new CompletedResponse(profileData, 'application/json'));
                       }
                    } else {
                        // Handle the case when 'result' is undefined or empty (no results)
                        reject(new ResourceNotFoundException(`No results found for profile with ID ${profileID}`));
                    }
                })  
            })     
            //return await getPromise.then(resp => {
             //   return resp; 
            //}).catch(error => {
            //     return ErrorHandler.handleError(error);
           // });
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    
    async ListProfile(userID) {
        try {
    
            if (!userID) {
                throw new ValidationException("Invalid userID");
            }
    
            const connectionDB = await db.connection;
            const query = `SELECT * FROM profile WHERE user_id = '${userID}'`;
            var listPromise = new Promise((resolve, reject) => {
                connectionDB.query(query, function (err, result) {
                    if (err) {
                        reject(new InternalServerException(err));
                        console.log("Got result");
                        console.log(result.length);
                    }
                    
                    if (result.length === 0) {
                        console.log("Unable to find");
                        reject(new ResourceNotFoundException(`Unable to find profiles for user ${userID}`));
                    } else {
                        var string = JSON.stringify(result);
                        console.log('>> string: ', string);
                        resolve(new CompletedResponse(string, 'application/json'));
                    }
                });
            });
            return await listPromise.then(resp => {
                return resp;
            }).catch(err => {
                return ErrorHandler.handleError(err);
            });
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    

    async createProfile(userID) {
        try {
    
            if (!userID) {
                throw new ValidationException("Invalid userID");
            }
            
            var req_body = JSON.parse(this.postValue, this.validateJson);
    
            if (!req_body.username || !req_body.created_at || !req_body.height || !req_body.weight || !req_body.bmi || !req_body.age) {
                throw new ValidationException("Bad request: Incomplete profile data");
            }
            console.log(req_body);
    
            const connectionDB = await db.connection;
            var checkQuery = 'SELECT * FROM profile WHERE user_id = ? AND username = ? AND created_at = ? AND height = ? AND weight = ? AND bmi = ? AND age = ?  ';
            var getPromise = new Promise ((resolve, reject) => {
                connectionDB.query(checkQuery, [userID, req_body.username, req_body.created_at, req_body.height, req_body.weight, req_body.bmi, req_body.age], function (err, result) {
                        if (err)
                        reject (new InternalServerException(err));
                    
              
                        const resultFinal = JSON.stringify(result);
                        console.log(resultFinal);
                        if (resultFinal.length > 2){
                            reject( new ConflictException("Repeat Values "));
              
                        }else{
            var profileID = genUUID.generateShortUUID();
            profileID = BigInt(profileID);
            profileID = String(profileID).slice(0, 18);
            const query = "INSERT INTO profile VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            var result =  connectionDB.query(query, [profileID, userID,req_body.username, req_body.created_at, req_body.height, req_body.weight, req_body.bmi, req_body.age]);

            if (result.affectedRows === 0) {
                throw new InternalServerException("Profile creation failed");
            }
            

            resolve( new CompletedResponse(profileID, 'text/plain'));

            //return new CompletedResponse(`Profile created successfully', 'text/plain');
                    }
                });
            });
            return await getPromise.then(resp => {
            return resp;
                }).catch(err => {
                return ErrorHandler.handleError(err);
                })
                } catch (error) {
                    console.error(error);
                    return ErrorHandler.handleError(error);
                    }
         }

    async DeleteProfile(userID, profileID) {
        try {
    
            if (!userID || !profileID) {
                throw new ValidationException("Invalid userID or profileID");
            }
    
            const connectionDB = await db.connection;
            const query = `DELETE FROM profile WHERE user_id = '${userID}' AND profile_id = '${profileID}'`;
    
            var deletePromise = new Promise((resolve, reject) => {
                connectionDB.query(query, function (err, result) {
                    if (err) {
                        reject(new InternalServerException(err));
                    } else if (result.affectedRows == 0) {
                        reject(new ResourceNotFoundException(`No profile found with ID ${profileID} to delete`));
                    } else {
                        resolve(new CompletedResponse(`Profile with ID ${profileID} deleted successfully`, 'text/plain'));
                    }
                });
            });
    
            return await deletePromise.then(resp => {
                return resp;
            }).catch(err => {
                return ErrorHandler.handleError(err);
            });
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    async UpdateProfile(userID, profileID) {
        try {
    
      
            if (!userID || !profileID) {
                throw new ValidationException("Invalid userID or profileID");
            }
    
            var req_body = JSON.parse(this.postValue);
    
            const updates = [];
            //const validFields = ['username', 'created_at', 'height', 'weight', 'bmi', 'age'];
    
            // Constructing the update statement based on the fields provided in the JSON
            for (const key of Object.keys(req_body)) {
                if (req_body[key] !== null && key !=="userID" && key !== "profileID") {
                    updates.push(`${key} = '${req_body[key]}'`);
                }
            }
    
            if (updates.length === 0) {
                throw new ValidationException("Bad request: No valid fields to update");
            }
    
            console.log(updates);
            const updateQuery = `UPDATE profile SET ${updates.join(', ')} WHERE user_id = '${userID}' AND profile_id = '${profileID}'`;
            console.log(updateQuery);
    
            const connectionDB = await db.connection;
            const result = await connectionDB.query(updateQuery);
    
            if (result.affectedRows === 0) {
              throw new ResourceNotFoundException(`No profile found with ID ${profileID} to update`);
            }
    
            console.log(`Profile with ID ${profileID} updated successfully`);
            return new CompletedResponse(`Profile with ID ${profileID} updated successfully`, 'text/plain');
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
}

module.exports = { ProfileHandler };    