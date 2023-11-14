const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');
const ErrorHandler = require('../util/error-handler.js');
const genUUID = require('../util/util.js');
const {
    ValidationException,
    ResourceNotFoundException,
    AccessDeniedException,
	InternalServerException
} = require('../util/exceptions.js');

const { 
    CompletedResponse
} = require('../util/response');

const { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat} = require('../constants/enumConstants.js');

class ExerciseHandler extends Handler {

	async handle(req) {
        try {

			await req.on('data', chunk => {super.accumulateChunkData(chunk);});
        	await req.on('end', () => {});
          	switch (req.method) {
				case "POST":	
					return this.CreateExercise(req);
				case "GET":
				if (req.url.split('/').length == 4) {
					return this.GetExercise(req);
				} else {
					var resp =  this.ListExercise(req);
					console.log(resp);
					return resp;
				}
				case "PUT":
				return this.UpdateExercise(req);
				case "DELETE":
				return this.DeleteExercise(req);
				default:
					throw new ValidationException("Invalid HTTP method");
          }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }

    #validateJson(key, value){
        try {
            if(key == "name"){
                return String(value);
            }
            if(key == "target_muscle_group"){
                return String(value);
            }
            if(key == "forces"){
                return String(value);
            }
            if(key == "rest_interval"){
                return Date(value);
            }
            if(key == "progression"){
                return String(value);
            }
            if(key == "link"){
                return String(value);
            }
        }
        catch(err){
            throw new Response.ValidationException("Error validating exercise json :" + err);
        }
    }
	
	async CreateExercise(req) {
		try {   
			const userURL = req.url.split('/');
			const userID = userURL[1];
		
			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
	
			var req_body = JSON.parse(this.postValue, this.#validateJson());
		
			if (!req_body.progression || !req_body.name || !req_body.forces || !req_body.rest_interval || !req_body.target_muscle_group) {
				throw new ValidationException("Bad request: Incomplete exercise data");

			}
			
		
			const validForces = enumList.forceEnum;
			const validProgression = enumList.progressionEnum;
			const validMuscleGroups = enumList.targetMuscleEnum;

			if (!validForces.includes(req_body.forces)) {
				throw new ValidationException("Bad request: Invalid forces");
			  }
			if (req_body.progression && !validProgression.includes(req_body.progression)) {
				throw new ValidationException("Bad request: Invalid progression");
			  }  
			if (req_body.target_muscle_group && !validMuscleGroups.includes(req_body.target_muscle_group)) {
				throw new ValidationException("Bad request: Invalid target_muscle_group");
			  }
			if (!isValidTimeFormat(req_body.rest_interval)) {
				throw new ValidationException("Bad request: Invalid rest_interval format. Please use 'hh:mm:ss' format.");
			  }
		
			
				var exerciseID = genUUID.generateShortUUID();
				exerciseID = BigInt(exerciseID);
          		exerciseID = String(exerciseID).slice(0, 18);
          		exerciseID = BigInt(exerciseID);
				const connectionDB = await db.connection;
				const query = "INSERT INTO exercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
				await connectionDB.query(query, [exerciseID, userID, req_body.name, req_body.target_muscle_group, req_body.forces, req_body.rest_interval, req_body.progression, req_body.link]);
				return new CompletedResponse(String(exerciseID) , 'text/plain');
        } catch (error) {
			console.error(error);
            return ErrorHandler.handleError(error);
        }
	}
	
async ListExercise(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];
	
			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
	
			const connectionDB = await db.connection;
			const exerciseQuery = `SELECT * FROM exercise WHERE userID = '${userID}'`;
			const defaultExerciseQuery = `SELECT * FROM defaultexercise`;
	
			const userExercises = await new Promise((resolve, reject) => {
				connectionDB.query(exerciseQuery, function (err, result) {
					if (err) reject(new Response.InternalServerException(err));
					resolve(result);
				});
			});
	
			const defaultExercises = await new Promise((resolve, reject) => {
				connectionDB.query(defaultExerciseQuery, function (err, result) {
					if (err) reject(new Response.InternalServerException(err));
					resolve(result);
				});
			});
			const combinedJSONdefault = JSON.stringify(defaultExercises);
			const combinedJSONuser = JSON.stringify(userExercises);
			console.log(combinedJSONuser);
			console.log(combinedJSONdefault);
			const combinedExercises = [...userExercises, ...defaultExercises];
			const combinedJSON = JSON.stringify(combinedExercises);
	
			if (combinedExercises.length === 0) {
				return new CompletedResponse("No exercises found", 'text/plain');
			} else {
				return new CompletedResponse(combinedJSON, 'application/json');
			}
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	
	

	async GetExercise(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];
			const exerciseID = userURL[3];
			console.log(exerciseID);
			console.log(userID);
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM exercise WHERE userID = '${userID}' AND exerciseID = '${exerciseID}' LIMIT 1`;
            var getPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err)
						reject (new InternalServerException(err));
						
					if (result == null || result.length == 0){
						console.log("Unable to find");
						reject(new ResourceNotFoundException(`Unable to find exercise with id: ${exerciseID}`));
					} else {
						console.log("Got result");
						console.log(result.length);
	
					var string= JSON.stringify(result);
					console.log('>> string: ', string );
					resolve(new CompletedResponse(string, 'application/json'));			
					}
				
				 });
			});

			return await getPromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			})
    
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
	}

	async UpdateExercise(req) {
		const userURL = req.url.split('/');
		const userID = userURL[1];
		const exerciseID = userURL[3];
		
		try {
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
	
			var req_body = JSON.parse(this.postValue);
	
			const updates = [];
			const validTargetMuscleGroups = enumList.targetMuscleEnum;
			const validForces = enumList.forceEnum;
			const validProgressions = enumList.progressionEnum;

			//Checks
			if (req_body.target_muscle_group && !validTargetMuscleGroups.includes(req_body.target_muscle_group)) {
				throw new ValidationException("Bad request: Invalid target_muscle_group value");
			  }
			if (req_body.forces && !validForces.includes(req_body.forces)) {
				throw new ValidationException("Bad request: Invalid forces value");
			  }
			if (req_body.progression && !validProgressions.includes(req_body.progression)) {
				throw new ValidationException("Bad request: Invalid progression value");
			  }
			if (!isValidTimeFormat(req_body.rest_interval)) {
				throw new ValidationException("Bad request: Invalid rest_interval format. Please use 'hh:mm:ss' format.");
			  }

	
			for (const key of Object.keys(req_body)) {
				if (req_body[key] !== null && key !== 'exerciseID' && key !== 'userID') {
					updates.push(`${key}='${req_body[key]}'`);
				}
			}
			
			if (updates.length === 0) {
				throw new ValidationException("Bad request: No valid fields to update");
			}
	
			const updateQuery = `UPDATE exercise SET ${updates.join(', ')} WHERE userID='${userID}' AND exerciseID='${exerciseID}'`;	
			
			const connectionDB = await db.connection;
			await connectionDB.query(updateQuery, function (err, result) {
				console.log(err);
				console.log(result);
			 });
			
	
			console.log(`Record with exerciseID ${exerciseID} updated successfully`);
			return new CompletedResponse(`Record with exerciseID ${exerciseID} updated successfully`, 'text/plain');
	
		} catch (error) {
			return ErrorHandler.handleError(error);
		}
	}
	
	
	async DeleteExercise(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];
			const exerciseID = userURL[3];
	
			if (!userID || !exerciseID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
	
			const connectionDB = await db.connection;
			const query = `DELETE FROM exercise WHERE userID = '${userID}' AND exerciseID = ${exerciseID}`;
			console.log(query);
			var response = null;
			var deletePromise = new Promise((resolve, reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) {
						reject(new InternalServerException(err));
					} else if (result.affectedRows == 0) {
						reject(new ResourceNotFoundException(`No record found with exerciseID ${exerciseID} to delete`));
					} else {
						resolve(new CompletedResponse(`Record with exerciseID ${exerciseID} deleted successfully`, 'text/plain'));
						console.log("e");
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
	
}

module.exports = { ExerciseHandler };
