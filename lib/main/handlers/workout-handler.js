const { Handler } = require("./handler");
const db = require('../util/sqlconnector.js')
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
  
class WorkoutHandler extends Handler {
  async handle(req) {
    try {
      await req.on('data', chunk => { super.accumulateChunkData(chunk);});
     await req.on('end', () => {});
      switch (req.method) {
        case "POST":
          return this.CreateWorkout(req);
        case "GET":
          if (req.url.split('/').length == 4) {
            return this.GetWorkout(req);
          } else {
            return this.ListWorkout(req);
          }
        case "PUT":
          return this.UpdateWorkout(req);
        case "DELETE":
          return this.DeleteWorkout(req);
        default:
            throw new ValidationException("Invalid HTTP method");
      }
    } catch (error) {
        return ErrorHandler.handleError(err);
    }
}

async ListWorkout(req) {
  try {
      const userURL = req.url.split('/');
      const userID = userURL[1];

      if (!userID) {
          throw new ValidationException("Invalid userID");
      }

      const connectionDB = await db.connection;
      const query = `SELECT * FROM workout WHERE user_id = '${userID}'`;
      var response = null;

      var listPromise = new Promise((resolve, reject) => {
          connectionDB.query(query, function (err, result) {
              if (err)
                  reject(new Response.InternalServerException(err));

              console.log("Got result");
              console.log(result.length);
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


    async GetWorkout(req) {
      try {
          const userURL = req.url.split('/');
          const userID = userURL[1];
          const workoutID = userURL[3];
          console.log(workoutID);
          console.log(userID);
          if (!userID || !workoutID) {
              throw new ValidationException("Invalid userID or workoutID");
          }
          
          const connectionDB = await db.connection;
          const query = `SELECT * FROM workout WHERE user_id = '${userID}' AND workout_id = '${workoutID}'`;
          
          return new Promise((resolve, reject) => {
              connectionDB.query(query, function (err, result) {
                  if (err) {
                      reject(new Response.InternalServerException(err));
                  }
                  console.log("Got result");
                  console.log(result.length);
                  if (result.length === 0) {
                      console.log("Unable to find");
                      reject(new Response.ResourceNotFoundException(`Unable to find record with name ${id}`));
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
  

    async CreateWorkout(req) {
      try {
        const userURL = req.url.split('/');
        const userID = userURL[1];
    
        if (!userID) {
          throw new ValidationException("Invalid userID");
        }
    

        var req_body = JSON.parse(this.postValue, this.#validateJson());
        console.log(req_body);
    
        if (!req_body.name || !req_body.difficulty || !req_body.timeStart || !req_body.timeEnd || !req_body.date || !req_body.status) {
          throw new ValidationException("Bad request: Incomplete workout data");
        }
    
        const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
        const validStatusus = ['IN_PROGRESS', 'COMPLETED', 'STARTED'];
     
        if (!validDifficulties.includes(req_body.difficulty) || !validStatusus.includes(req_body.status))  {
          throw new ValidationException("Bad request: Invalid workout values");
        }
    
        var workoutID = genUUID.generateShortUUID();
    
        const connectionDB = await db.connection;
        const query = "INSERT INTO workout VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const result = await connectionDB.query(query, [workoutID, req_body.name, userID, req_body.difficulty, req_body.timeStart, req_body.timeEnd, req_body.date, req_body.status]);
        var string = JSON.stringify(result[0]);
        console.log(string);
        return new CompletedResponse(workoutID, 'text/plain');
      } catch (error) {
        return ErrorHandler.handleError(error);
      }
    }
    
    async UpdateWorkout(req) {
      const userURL = req.url.split('/');
      const userID = userURL[1];
      const workoutID = userURL[3];
  
      try {
          if (!userID || !workoutID) {
              throw new ValidationException("Invalid userID or workoutID");
          }
  
          var req_body = JSON.parse(this.postValue);
  
          const updates = [];
          const validDifficulties = ['easy', 'medium', 'hard', 'near_maximum', 'limit', 'failure'];
          const validStatuses = ['IN_PROGRESS', 'COMPLETED', 'STARTED'];
  
          // Check if the difficulty is valid
          if (req_body.difficulty && !validDifficulties.includes(req_body.difficulty)) {
              throw new ValidationException("Bad request: Invalid difficulty value");
          }
  
          // Check if the status is valid
          if (req_body.status && !validStatuses.includes(req_body.status)) {
              throw new ValidationException("Bad request: Invalid status value");
          }
  
          // Constructing the update statement based on the fields provided in the JSON
          for (const key of Object.keys(req_body)) {
              if (req_body[key] !== null && key !== 'workoutID' && key !== 'userID') {
                  updates.push(`${key} = '${req_body[key]}'`);
              }
          }
  
          if (updates.length === 0) {
              throw new ValidationException("Bad request: No valid fields to update");
          }
  
          const updateQuery = `UPDATE workout SET ${updates.join(', ')} WHERE user_id = '${userID}' AND workout_id = '${workoutID}'`;
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
  

  async DeleteWorkout(req) {
    try {
        const userURL = req.url.split('/');
        const userID = userURL[1];
        const workoutID = userURL[3];

        if (!userID || !workoutID) {
            throw new ValidationException("Invalid userID or workoutID");
        }

        const connectionDB = await db.connection;
        const query = `DELETE FROM workout WHERE user_id = '${userID}' AND workout_id = '${workoutID}'`;
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


  /*  async processBody(req){    
      await req.on('data', chunk => {
          super.accumulateChunkData(chunk);
      });
      await req.on('end', () => {
      });
      return this.CreateWorkout(req);
  }*/


    #validateJson(key, value){
      try {
          if(key == "name"){
              return String(value);
          }
          if(key == "difficulty"){
              return String(value)
          }
          if(key == "timeStart"){
              return String(value);
          }
          if(key == "timeEnd"){
              return String(value);
          }
          if(key == "date"){
              return String(value);
          }
          if(key == "status"){
            return String(value);
        }
      }
      catch(err){
          throw new Response.ValidationException("Error validating json :" + err);
      }
  }
}


module.exports = { WorkoutHandler };



