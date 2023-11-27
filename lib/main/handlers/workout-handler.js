const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js')
const ErrorHandler = require('../util/error-handler.js')
const {generateShortUUID, getUserID, getTypeID} = require('../util/util.js');
const ServerUtil = require('../util/server-utils.js')

const {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    AccessDeniedException,
    ConflictException
} = require('../util/exceptions.js');
  
const { 
    CompletedResponse
} = require('../util/response');
  
const { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat} = require('../constants/enumConstants.js');


class WorkoutHandler extends Handler {

  #parseBody(useValidator = false){
    try{
      return useValidator ? JSON.parse(this.postValue, this.#validateJson()) : JSON.parse(this.postValue);
    } catch(err){
      throw new ValidationException("Error validating json :" + err);
    }
  }

  async handle(req) {
    try {
      await req.on('data', chunk => { super.accumulateChunkData(chunk);});
     await req.on('end', () => {});
      switch (req.method) {
        case "POST":
          return this.CreateWorkout(getUserID(req.url));
        case "GET":
          if (req.url.split('/').length == 4) {
            return this.GetWorkout(getUserID(req.url), getTypeID(req.url));
          } else {
            return this.ListWorkout(getUserID(req.url));
          }
        case "PUT":
          return this.UpdateWorkout(getUserID(req.url), getTypeID(req.url));
        case "DELETE":
          return this.DeleteWorkout(getUserID(req.url), getTypeID(req.url));
        default:
            throw new ValidationException("Invalid HTTP method");
      }
    } catch (error) {
        return ErrorHandler.handleError(err);
    }
}

async ListWorkout(userID) {
  try {

      if (!userID) {
          throw new ValidationException("Invalid userID");
      }

      const connectionDB = await db.connection;
      const query = `SELECT * FROM workout WHERE userID = '${userID}'`;
      var response = null;

      var listPromise = new Promise((resolve, reject) => {
          connectionDB.query(query, function (err, result) {
              if (err)
                  reject(new InternalServerException(err));
              if (result.length == 0) {
                  console.log("No workouts found for this user");
                  resolve(new CompletedResponse("No workouts found for this user", 'text/plain'));
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

async GetWorkout(userID, workoutID) {
  try {

    if (!userID || !workoutID) {
      throw new ValidationException("Invalid userID or workoutID");
    }

    const connectionDB = await db.connection;
    const query = `SELECT * FROM workout WHERE userID = '${userID}' AND workoutID = '${workoutID}'`;

    return new Promise((resolve, reject) => {
      connectionDB.query(query, function (err, result) {
        if (err) {
          reject(new InternalServerException(err));
        }

        if (result.length === 0) {
          console.log("Unable to find");
          reject(new Response.ResourceNotFoundException(`No workout found with workoutID ${workoutID}`));
        } else {
          var string = JSON.stringify(result);
          console.log('>> string: ', string);
          resolve(new CompletedResponse(string, 'application/json'));
        }
      });
    });
  } catch (error) {
    return ErrorHandler.handleError(error);
  }
}

  
async CreateWorkout(userID) {
  
    try {
      if (!userID) {
        throw new ValidationException("Invalid userID");
      }
      
      var req_body = this.#parseBody(true);
      if (!req_body.name || !req_body.difficulty || !req_body.date || !req_body.status) {
        throw new ValidationException("Bad request: Incomplete workout data");
      }
  
      const validDifficulties = enumList.difficultyEnum;
      const validStatuses = enumList.statusEnum;
      
      //Respond with proper missing error
      if (req_body.difficulty && !validDifficulties.includes(req_body.difficulty)) {
        throw new ValidationException("Bad request: Invalid difficulty value");
      }
      if (!validStatuses.includes(req_body.status)) {
        throw new ValidationException("Bad request: Invalid status value");
      }
      if (!isValidDateFormat(req_body.date)) {
        throw new ValidationException("Bad request: Invalid date format. Please use 'YYYY-MM-DD' format.");
      }
      if (req_body.timeStart && !isValidTimeFormat(req_body.timeStart)) {
        throw new ValidationException("Bad request: Invalid timeStart format. Please use 'hh:mm:ss' format.");
      }
      if (req_body.timeEnd && !isValidTimeFormat(req_body.timeEnd)) {
        throw new ValidationException("Bad request: Invalid timeEnd format. Please use 'hh:mm:ss' format.");
      }
  
  
      const connectionDB = await db.connection;
      var checkQuery = 'SELECT * FROM workout WHERE name = ? AND userID = ? AND difficulty = ? AND timeStart = ? AND timeEnd = ? AND date = ? AND status = ?';
      var getPromise = new Promise ((resolve, reject) => {
        connectionDB.query(checkQuery,[req_body.name, userID,  req_body.difficulty, req_body.timeStart, req_body.timeEnd, req_body.date, req_body.status], function (err, result) {
          if (err)
          reject (new InternalServerException(err));

          const resultFinal = JSON.stringify(result);
          console.log(result);

          if (resultFinal.length > 2){
           reject( new ConflictException("Repeat Values "));
            

          }else{
      var workoutID = generateShortUUID();
      
      const query = "INSERT INTO workout VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const result =  connectionDB.query(query, [workoutID, req_body.name, userID, req_body.difficulty, req_body.timeStart, req_body.timeEnd, req_body.date, req_body.status]);
      var string = JSON.stringify(result[0]);
      resolve( new CompletedResponse(String(workoutID), 'text/plain'));
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
  

    async UpdateWorkout(userID, workoutID) {
      
        try {
          if (!userID || !workoutID) {
            throw new ValidationException("Invalid userID or workoutID");
          }
      
          var req_body = this.#parseBody();
      
          const updates = [];
         
          const validDifficulties = enumList.difficultyEnum;
          const validStatuses = enumList.statusEnum;
      
          // Validate and update other fields as needed
          if (req_body.date) {
            if (isValidDateFormat(req_body.date)) {
                updates.push(`date = '${req_body.date}'`);
            } else {
                throw new ValidationException("Bad request: Invalid date format");
            }
         }
      
         if (req_body.timeStart) {
          if (isValidTimeFormat(req_body.timeStart)) {
            updates.push(`timeStart = '${req_body.timeStart}'`);
          } else {
            throw new ValidationException("Bad request: Invalid timeStart format");
          }
        }
      
        if (req_body.timeEnd) {
          if (isValidTimeFormat(req_body.timeEnd)) {
            updates.push(`timeEnd = '${req_body.timeEnd}'`);
          } else {
            throw new ValidationException("Bad request: Invalid timeEnd format");
          }
        }

        if (req_body.difficulty) {
          if (!validDifficulties.includes(req_body.difficulty)) {
             throw new ValidationException("Bad request: Invalid difficulty value");
          } else {
             updates.push(`difficulty = '${req_body.difficulty}'`);
          }
        }

         if (req_body.status) {
          if (!validStatuses.includes(req_body.status)) {
             throw new ValidationException("Bad request: Invalid status value");
          } else {
             updates.push(`status = '${req_body.status}'`);
           }
        }
      
        if (req_body.name) {
          updates.push(`name = '${req_body.name}'`);
        }
        if (req_body.timeStart) {
          updates.push(`timeStart = '${req_body.timeStart}'`);
        }
        if (req_body.timeEnd) {
          updates.push(`timeEnd = '${req_body.timeEnd}'`);
        }
        if (req_body.date) {
          updates.push(`date = '${req_body.date}'`);
        }
        if (updates.length === 0) {
          throw new ValidationException("Bad request: No valid fields to update");
        }
      
          const updateQuery = `UPDATE workout SET ${updates.join(', ')} WHERE userID = '${userID}' AND workoutID = '${workoutID}'`;
          console.log(updateQuery);
          const connectionDB = await db.connection;
          const result = await connectionDB.query(updateQuery);
      
          if (result.affectedRows === 0) {
            throw new ResourceNotFoundException(`No record found with workoutID ${workoutID} to update`);
          }
      
          console.log(`Record with workoutID ${workoutID} updated successfully`);
          return new CompletedResponse(`Record with workoutID ${workoutID} updated successfully`, 'text/plain');
        } catch (error) {
          return ErrorHandler.handleError(error);
        }
      }
      
      
  async DeleteWorkout(userID, workoutID) {
    try {

        if (!userID || !workoutID) {
            throw new ValidationException("Invalid userID or workoutID");
        }

        const connectionDB = await db.connection;
        const query = `DELETE FROM workout WHERE userID = '${userID}' AND workoutID = ${workoutID}`;
        var response = null;
        var deletePromise = new Promise((resolve, reject) => {
            connectionDB.query(query, function (err, result) {
                if (err) {
                    reject(new InternalServerException(err));
                } else if (result.affectedRows == 0) {
                    reject(new ResourceNotFoundException(`No record found with workoutID ${workoutID} to delete`));
                } else {
                    resolve(new CompletedResponse(`Record with workoutID ${workoutID} deleted successfully`, 'text/plain'));
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




    #validateJson(key, value){
          if(key == "name"){
              return String(value);
          }
          if(key == "difficulty"){
              return String(value)
          }
          if(key == "timeStart"){
              return Date(value);
          }
          if(key == "timeEnd"){
              return Date(value);
          }
          if(key == "date"){
              return Date(value);
          }
          if(key == "status"){
            return String(value);
        }
  }
}


module.exports = { WorkoutHandler };



