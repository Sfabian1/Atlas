const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js')
const ErrorHandler = require('../util/error-handler.js')
const genUUID = require('../util/util.js')

const {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    AccessDeniedException
} = require('../util/exceptions.js');
  
const { 
    CompletedResponse
} = require('../util/response.js');
  

class SetHandler extends Handler {

   async handle(req) {
        try {
          switch (req.method) {
            case "POST":
              return this.processBodyCreate(req);
            case "GET":
              if (req.url.split('/').filter(Boolean).length === 3) {
                return this.GetSet(req);
              } else {
                return this.ListSets(req);
              }
            case "PUT":
              return this.processBodyPush(req);
            case "DELETE":
              return this.DeleteSet(req);
            default:
                throw new ValidationException("Invalid HTTP method");
          }
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    
    async GetSet(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];
			const setID = userURL[3];
            
			if (!userID || !setID) {
				throw new ValidationException("Invalid userID or setID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM sets WHERE userID = '${userID}' AND setID = '${setID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new ResourceNotFoundException(`Unable to find record with name ${setID}`));
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

    async ListSets(req) {
		try {
			const userURL = req.url.split('/');
			const userID = userURL[1];

			if (!userID) {
				throw new ValidationException("Invalid userID");
			}
           
            const connectionDB = await db.connection;
            const query = `SELECT * FROM sets WHERE userID = '${userID}'`;
			var response = null;
            var listPromise = new Promise ((resolve,reject) => {
				connectionDB.query(query, function (err, result) {
					if (err) 
						reject (new InternalServerException(err));
					console.log("Got result");
					console.log(result.length);
					if (result.length == 0){
						console.log("Unable to find");
						reject(new ResourceNotFoundException(`Unable to find record with name ${setID}`));
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


    async CreateSet(req) {
        function isValidDateFormat(date) {
          // Define your date format validation logic here
          return /^\d{4}-\d{2}-\d{2}$/.test(date);
        }
      
        function isValidTimeFormat(time) {
          // Define your time format validation logic here (hh:mm:ss)
          return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
        }
      
        try {
          const userURL = req.url.split('/');
          const userID = userURL[1];
      
          if (!userID) {
            throw new ValidationException("Invalid userID");
          }
      
          var req_body = JSON.parse(this.postValue, this.#validateJson());
      
          if (!req_body.exerciseID || !req_body.workoutID || !req_body.Date || !req_body.difficulty || !req_body.time_start) {
            throw new ValidationException("Bad request: Incomplete set data");
          }
      
          const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
          const validWeightMetrics = ['lbs', 'kg', 'ton', 'tonne'];
          const validDistanceMetrics = ['feet', 'yards', 'miles', 'meters', 'kilometers'];
      
          // Check if the difficulty is valid
          if (req_body.difficulty && !validDifficulties.includes(req_body.difficulty)) {
            throw new ValidationException("Bad request: Invalid difficulty value");
          }
      
          // Validate date format
          if (!isValidDateFormat(req_body.Date)) {
            throw new ValidationException("Bad request: Invalid date format. Please use 'YYYY-MM-DD' format.");
          }
      
          // Validate time format for time_start and time_end
          if (req_body.time_start && !isValidTimeFormat(req_body.time_start)) {
            throw new ValidationException("Bad request: Invalid time_start format. Please use 'hh:mm:ss' format.");
          }
      
          if (req_body.time_end && !isValidTimeFormat(req_body.time_end)) {
            throw new ValidationException("Bad request: Invalid time_end format. Please use 'hh:mm:ss' format.");
          }
          if (req_body.rep_time && !isValidTimeFormat(req_body.rep_time)) {
            throw new ValidationException("Bad request: Invalid rep_time format. Please use 'hh:mm:ss' format.");
          }
          if (req_body.rest_period && !isValidTimeFormat(req_body.rest_period)) {
            throw new ValidationException("Bad request: Invalid rest period format. Please use 'hh:mm:ss' format.");
          }
      
          if (req_body.weight_metric && !validWeightMetrics.includes(req_body.weight_metric)) {
            throw new ValidationException("Bad request: Invalid weight_metric value");
          }
          
          if (req_body.distance_metric && !validDistanceMetrics.includes(req_body.distance_metric)) {
            throw new ValidationException("Bad request: Invalid distance_metric value");
          }
      
          var setID = genUUID.generateShortUUID();
      
          const connectionDB = await db.connection;
          const query = "INSERT INTO sets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const result = await connectionDB.query(query, [
            setID,
            req_body.exerciseID,
            userID,
            req_body.workoutID,
            req_body.Date,
            req_body.num_of_times,
            req_body.weight,
            req_body.weight_metric,
            req_body.distance,
            req_body.distance_metric,
            req_body.rep_time,
            req_body.rest_period,
            req_body.difficulty,
            req_body.time_start,
            req_body.time_end
          ]);
      
          var string = JSON.stringify(result[0]);
      
          return new CompletedResponse(setID, 'text/plain');
        } catch (error) {
          return ErrorHandler.handleError(error);
        }
      }
      
      async UpdateSet(req) {
        const userURL = req.url.split('/');
        const userID = userURL[1];
        const setID = userURL[3];
    
        try {
            if (!userID || !setID) {
                throw new ValidationException("Invalid userID or setID");
            }
    
            var req_body = JSON.parse(this.postValue, this.#validateJson());
    
            const updates = [];
            const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
            const validWeightMetrics = ['lbs', 'kg', 'ton', 'tonne'];
            const validDistanceMetrics = ['feet', 'yards', 'miles', 'meters', 'kilometers'];
    
            function isValidDateFormat(date) {
                // Define your date format validation logic here
                return /^\d{4}-\d{2}-\d{2}$/.test(date);
            }
    
            function isValidTimeFormat(time) {
                // Define your time format validation logic here (hh:mm:ss)
                return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
            }
    
            if (req_body.Date) {
                if (isValidDateFormat(req_body.Date)) {
                    updates.push(`Date = '${req_body.Date}'`);
                } else {
                    throw new ValidationException("Bad request: Invalid Date format");
                }
            }
    
            if (req_body.time_start) {
                if (isValidTimeFormat(req_body.time_start)) {
                    updates.push(`time_start = '${req_body.time_start}'`);
                } else {
                    throw new ValidationException("Bad request: Invalid time_start format");
                }
            }
    
            if (req_body.time_end) {
                if (isValidTimeFormat(req_body.time_end)) {
                    updates.push(`time_end = '${req_body.time_end}'`);
                } else {
                    throw new ValidationException("Bad request: Invalid time_end format");
                }
            }

            if (req_body.rep_time) {
                if (isValidTimeFormat(req_body.rep_time)) {
                    updates.push(`time_end = '${req_body.rep_time}'`);
                } else {
                    throw new ValidationException("Bad request: Invalid rep_time format");
                }
            }

            if (req_body.rest_period) {
                if (isValidTimeFormat(req_body.rest_period)) {
                    updates.push(`time_end = '${req_body.rest_period}'`);
                } else {
                    throw new ValidationException("Bad request: Invalid rest_period format");
                }
            }
    
            if (req_body.difficulty) {
                if (!validDifficulties.includes(req_body.difficulty)) {
                    throw new ValidationException("Bad request: Invalid difficulty value");
                } else {
                    updates.push(`difficulty = '${req_body.difficulty}'`);
                }
            }
    
            if (req_body.weight_metric) {
                if (!validWeightMetrics.includes(req_body.weight_metric)) {
                    throw new ValidationException("Bad request: Invalid weight_metric value");
                } else {
                    updates.push(`weight_metric = '${req_body.weight_metric}'`);
                }
            }
    
            if (req_body.distance_metric) {
                if (!validDistanceMetrics.includes(req_body.distance_metric)) {
                    throw new ValidationException("Bad request: Invalid distance_metric value");
                } else {
                    updates.push(`distance_metric = '${req_body.distance_metric}'`);
                }
            }
    
            // Constructing the update statement based on the fields provided in the JSON
            for (const key of Object.keys(req_body)) {
                if (key !== 'setID' && key !== 'userID') {
                    updates.push(`${key} = '${req_body[key]}'`);
                }
            }
    
            if (updates.length === 0) {
                throw new ValidationException("Bad request: No valid fields to update");
            }
    
            const updateQuery = `UPDATE sets SET ${updates.join(', ')} WHERE userID = '${userID}' AND setID = '${setID}'`;
            const connectionDB = await db.connection;
            const result = await connectionDB.query(updateQuery);
    
            if (result.affectedRows === 0) {
                throw new ResourceNotFoundException(`No record found with setID ${setID} to update`);
            }
    
            console.log(`Record with setID ${setID} updated successfully`);
            return new CompletedResponse(`Record with setID ${setID} updated successfully`, 'text/plain');
        } catch (error) {
            return ErrorHandler.handleError(error);
        }
    }
    

    async DeleteSet(req) {
        try {
            const userURL = req.url.split('/');
            const userID = userURL[1];
            const setID = userURL[3];
    
            if (!userID || !setID) {
                throw new ValidationException("Invalid userID or setID");
            }
    
            const connectionDB = await db.connection;
            const query = `DELETE FROM sets WHERE userID = '${userID}' AND setID = '${setID}'`;
            var response = null;
            var deletePromise = new Promise ((resolve, reject) => {
                connectionDB.query(query, function (err, result) {
                    if (err) {
                        reject(new InternalServerException(err));
                    } else if (result.affectedRows == 0) {
                        reject(new ResourceNotFoundException(`No record found with setID ${setID} to delete`));
                    } else {
                        resolve(new CompletedResponse(`Record with setID ${setID} deleted successfully`, 'text/plain'));
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

    async processBodyCreate(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.CreateSet(req);
    }

    async processBodyPush(req){    
        await req.on('data', chunk => {
            super.accumulateChunkData(chunk);
        });

        await req.on('end', () => {

        });
        return this.UpdateSet(req);
    }

    #validateJson(key, value){
        try {
            if(key == "exerciseID"){
                return String(value);
            }
            if(key == "workoutID"){
                return String(value)
            }
            if(key == "Date"){
                return Date(value);
            }
            if(key == "num_of_times"){
                return Number(value);
            }
            if(key == "weight"){
                return Number(value);
            }
            if(key == "weight_metric"){
                return String(value);
            }
            if(key == "distance"){
                return Number(value);
            }
            if(key == "distance_metric"){
                return String(value);
            }
            if(key == "rep_time"){
                return Date(value);
            }
            if(key == "rest_period"){
                return String(value);
            }
            if(key == "time_start"){
                return Date(value);
            }
            if(key == "time_end"){
                return Date(value);
            }
        }
        catch(err){
            throw new Response.ValidationException("Error validating json :" + err);
        }
    }

}

module.exports = { SetHandler };
