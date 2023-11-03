const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js');
const ErrorHandler = require('../util/error-handler.js')
const genUUID = require('../util/util.js')
const {
    ValidationException,
    ResourceNotFoundException,
    AccessDeniedException
} = require('../util/exceptions.js');

const { 
    CompletedResponse
} = require('../util/response');


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
					var resp =  this.ListExercises(req);
					console.log(resp);
					return resp;
				}
				case "PUT":
				return this.UpdateSet(req);
				case "DELETE":
				return this.DeleteSet(req);
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
            if(key == "force"){
                return String(value);
            }
            if(key == "rest_interval"){
                return String(value);
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
		
			if (!req_body.progression || !req_body.name || !req_body.force || !req_body.rest_interval || !req_body.target_muscle_group) {
				throw new ValidationException("Bad request: Incomplete exercise data");

			}
			console.log(req_body);
			const validForce = ['push', 'pull'];
			const validProgression = ['weight', 'reps', 'time', 'distance'];
			const validMuscle_Groups = [
				'abdominals',
				'biceps',
				'calves',
				'chest',
				'forearm',
				'glutes',
				'grip',
				'hamstrings',
				'hips',
				'lats',
				'lower_back',
				'middle_back',
				'neck',
				'quadriceps',
				'shoulders',
				'triceps'
			];
		
			if (!validForce.includes(req_body.force) || 
				(req_body.progression && !validProgression.includes(req_body.progression)) ||
				(req_body.target_muscle_group && !validMuscle_Groups.includes(req_body.target_muscle_group))) {
					throw new ValidationException("Bad request: Invalid force, progression, or target_muscle_group");
				}
		
			
				var exercise_ID = genUUID.generateShortUUID();
				const connectionDB = await db.connection;
				const query = "INSERT INTO exercise VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
				await connectionDB.query(query, [exercise_ID, userID, req_body.name, req_body.target_muscle_group, req_body.force, req_body.rest_interval, req_body.progression, req_body.link]);
				return new CompletedResponse(exercise_ID , 'text/plain');
        } catch (error) {
			console.error(error);
            return ErrorHandler.handleError(error);
        }
	}
	
	async ListExercises(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];

			if (!userID) {
				throw new ValidationException("Invalid userID or exerciseID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM exercise WHERE user_id = '${userID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new Response.InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new Response.ResourceNotFoundException(`Unable to find record with name ${id}`));
					} else {
	
					var string= JSON.stringify(result);
					console.log('>> string: ', string );
            		resolve(new CompletedResponse(string, 'application/json'));			
					}
				 });
			});

			return await listPromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			})
    
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
            const query = `SELECT * FROM exercise WHERE user_id = '${userID}' AND exercise_id = '${exerciseID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new Response.InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new Response.ResourceNotFoundException(`Unable to find record with name ${id}`));
					} else {
	
					var string= JSON.stringify(result);
					console.log('>> string: ', string );
            		resolve(new CompletedResponse(string, 'application/json'));			
					}
				 });
			});

			return await listPromise.then(resp => {
				return resp;
			}).catch(err => {
				return ErrorHandler.handleError(err);
			})
    
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
	}

	static async UpdateExercise(req, res) {
		try {
		const userID = req.params.userID;
		const exercise_id = req.params.exercise_id;
		if(!userID || !exercise_id) {
			return res.status(404).json({error: "Resource not found exception"});
		}
		const exercise_req = await queryDatabase("SELECT * FROM exercise WHERE user_id = ${userID} and exercise_id = ${exercise_id}");
		if(!exercise_req) {
			return res.status(400).json({error: "Bad Request"});
		}
		} catch (error) {
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({exercise: JSON.stringify(exercise_req)});
	}

	static async DeleteExercise(req, res) {
		try {
		const userID = req.params["userID"];
		const exercise_id = req.params["exercise_id"];
		if(!userID || !exercise_id) {
			return res.status(404).json({error: "Resource not found exception"});
		}
		const exerciseExists = await queryDatabase("SELECT exercise_id FROM exercise WHERE exercise_id = ${exercise_id} AND user_id = ${userID}");
		if(!exerciseExists) {
			return res.status(404).json({error: "Resource not found exception"});
		}
			await queryDatabase("DELETE FROM exercise WHERE exercise_id = ${exercise_id} AND user_id = ${userID}");
		} catch (error) {
			return res.status(500).json({error: "Internal server error"});
		}
		return res.status(200).json({message: "Exercise deleted successfully"});
}
}

module.exports = { ExerciseHandler };
