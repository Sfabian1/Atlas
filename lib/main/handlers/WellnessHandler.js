const {Handler} = require("../handlers/handler.js");
const errorHandler = require('../util/error-handler.js'); 
const {ValidationException, ResourceNotFoundException, InternalServerException, ConflictException} = require('../util/exceptions.js');
const {CompletedResponse} = require('../util/response.js');
const db = require('../util/sqlconnector.js');
const {genUUID, getUserID, getTypeID} = require('../util/util.js');
const { enumList, isValidDateFormat, isValidEnumValue , isValidTimeFormat} = require('../constants/enumConstants.js');

class WellnessHandler extends Handler {
  async handle(req) {
    try {
      await req.on('data', chunk => {super.accumulateChunkData(chunk);});
      await req.on('end', () => {});
      switch (req.method) {
        case "POST":
          return this.CreateWellness(getUserID(req.url));
        case "GET":
          if (req.url.split('/').filter(Boolean).length == 3) {
            return this.GetWellness(getUserID(req.url), getTypeID(req.url));
          } else {
            return this.ListWellness(getUserID(req.url));
          }
        case "PUT":
          return this.UpdateWellness(getUserID(req.url), getTypeID(req.url));
        case "DELETE":
          return this.DeleteWellness(getUserID(req.url), getTypeID(req.url));
        default:
            throw new ValidationException("Invalid HTTP method");
      }
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  async CreateWellness(userID) {
    try {
      if (!userID) {
        throw new ValidationException("UserID Invalid");
      }
      var req_body = JSON.parse(this.postValue, this.#validateJson());

      if (!req_body.date || !req_body.mood || !req_body.stress || !req_body.sleep || !req_body.motivation || !req_body.hydration || !req_body.soreness) {
        throw new ValidationException("Bad Request: Missing Fields");
      }
      
   isValidDateFormat("req_body.date",true);
     isValidEnumValue("moodEnum", req_body.mood,true);
   isValidEnumValue("stressEnum", req_body.stress,true);
    isValidEnumValue("sleepEnum", req_body.sleep,true);
    isValidEnumValue("motivationEnum", req_body.motivation,true);
    isValidEnumValue("hydrationEnum", req_body.hydration,true);
    isValidEnumValue("sorenessEnum", req_body.soreness, true);
      
    const connectionDB = await db.connection;
    var checkQuery = 'SELECT * FROM wellness WHERE user_ID = ? AND date = ? AND mood = ? AND stress = ? AND sleep = ? AND motivation = ? AND hydration = ? AND soreness = ? ';
    var getPromise = new Promise ((resolve, reject) => {
      connectionDB.query(checkQuery,[ userID, req_body.date, req_body.mood, req_body.stress, req_body.sleep, req_body.motivation, req_body.hydration, req_body.soreness ],
      function (err, result) {
      if (err)
      reject (new InternalServerException(err));

      const resultFinal = JSON.stringify(result);

      if (resultFinal.length > 2){
          reject( new ConflictException("Repeat Values "));
      } else {
        var wellnessID = genUUID.generateShortUUID();
        wellnessID = BigInt(wellnessID);
        wellnessID = String(wellnessID).slice(0, 18);
        wellnessID = BigInt(wellnessID);
        const query = "INSERT INTO wellness VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
   
        connectionDB.query(query, [wellnessID, userID, req_body.date, req_body.mood, req_body.stress, req_body.sleep, req_body.motivation, req_body.hydration, req_body.soreness]);
        resolve( new CompletedResponse(`New Wellness ID: ${wellnessID}`, "text/plain"));
      }
    });
});
return await getPromise.then(resp => {
    return resp;
}).catch(err => {
    return errorHandler.handleError(err);
})
} catch (error) {
    console.error(error);
  return errorHandler.handleError(error);
}
}

  async ListWellness(userID) {
    try {
    if (!userID) {
        throw new ValidationException("UserID Invalid");
    }
        const connectionDB = await db.connection;
        const query = `SELECT * FROM wellness WHERE user_id = '${userID}'`;
        var listPromise = new Promise((resolve,reject)=>{
            connectionDB.query(query, function (err,result){
              if(err){
                reject(new InternalServerException(err));
                console.log("Got result");
                console.log(result.length);
              }
              console.log(result.length);
              if (result.length == 0){
                  console.log("No Wellness Entries found for this user");
                  reject(new ResourceNotFoundException(`No Wellness Entries found for ${userID}`));
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
          return errorHandler.handleError(err);
  });
}catch(error) {
  return errorHandler.handleError(error);
}
}
      
async GetWellness(userID, wellnessID) {
    try {
  
    if (!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }
      const connectionDB = await db.connection;
      const query = `SELECT * FROM wellness WHERE user_id = '${userID}' AND wellness_id = '${wellnessID}'`;
      var getPromise = new Promise((resolve, reject) => {
        connectionDB.query(query, function (err, result) {
            if (err) {
                reject(new InternalServerException(err));
            }
            console.log("Got result");
            console.log(result.length);
            if (result.length === 0) {
                console.log("Wellness Entry Not Found");
                reject(new ResourceNotFoundException(`Wellness Entry Not Found with name ${wellnessID}`));
            }else {
                var string = JSON.stringify(result);
                console.log('>> string: ', string);
                resolve(new CompletedResponse(string, 'application/json'));
            }
        });
      });
      return await getPromise.then(resp =>{
        return resp;
      }).catch(err =>{
        return  errorHandler.handleError(err);
      });
    }catch(error) {
        return errorHandler.handleError(error);
    }
  }

  async UpdateWellness(userID, wellnessID) {
    try {
    
      if(!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }

    var req_body = JSON.parse(this.postValue);

    const updatedFields = [];
    isValidDateFormat(req_body.date, false);
     isValidEnumValue("moodEnum", req_body.mood,false);
   isValidEnumValue("stressEnum", req_body.stres,false);
    isValidEnumValue("sleepEnum", req_body.sleep,false);
    isValidEnumValue("motivationEnum", req_body.motivation,false);
    isValidEnumValue("hydrationEnum", req_body.hydration,false);
    isValidEnumValue("sorenessEnum", req_body.soreness,false);
      

    for (const key of Object.keys(req_body)) {
      if (req_body[key] !== null && key !== 'wellnessID' && key !== 'userID') {
        updatedFields.push(`${key} = '${req_body[key]}'`);
      }
    }
      if (updatedFields.length == 0) {
        throw new ValidationException("Bad request: No valid fields to update");
      }
      console.log(updatedFields);
      const updateQuery = `UPDATE wellness SET ${updatedFields.join(', ')} WHERE user_id = '${userID}' AND wellness_id = '${wellnessID}'`;
      const connectionDB = await db.connection;
      const result = await connectionDB.query(updateQuery);
      
   if(result.affectedRows === 0) {
     throw new ResourceNotFoundException(`No record found with wellnessID ${wellnessID} Not Found`);
    }
    console.log(`Record with wellnessID ${wellnessID} update succesful`);
    return new CompletedResponse(`Record with wellnessID ${wellnessID} update succesful`, 'text/plain');
    }catch (error) {
        return errorHandler.handleError(error);
    }
  }

  async DeleteWellness(userID, wellnessID) {
    try {
      if (!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
      }
      const connectionDB = await db.connection;
      const query = `DELETE FROM wellness WHERE user_id = '${userID}' AND wellness_id= '${wellnessID}'`;
      var deletePromise = new Promise((resolve, reject) => {
        connectionDB.query(query, function (err, result) {
            if (err) {
                reject(new InternalServerException(err));
            }else if (result.affectedRows == 0) {
                reject(new ResourceNotFoundException(`WellnessID ${wellnessID} Not Found`));
            }else {
                resolve(new CompletedResponse(`Record with wellnessID ${wellnessID} delete successful`, 'text/plain'));
            }
        });
      });
      return await deletePromise.then(resp => {
          return resp;
      }).catch(err => {
          return errorHandler.handleError(err);
      });
    }catch(error) {
        return errorHandler.handleError(error);
    }
  }

  #validateJson(key, value){
    try {
        if(key == "date"){
            return String(value);
        }
        if(key == "mood"){
            return String(value);
        }
        if(key == "stress"){
            return String(value);
        }
        if(key == "sleep"){
            return String(value);
        }
        if(key == "motivation"){
            return String(value);
        }
        if(key == "hydration"){
            return String(value);
        }
        if(key == "soreness"){
          return String(value);
      }
    }
    catch(err){
        throw new ValidationException("Error validating wellness json :" + err);
    } 
  }
}

module.exports = {WellnessHandler};
