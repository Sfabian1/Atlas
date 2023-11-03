const {Handler} = require("../handlers/handler.js");
const errorHandler = require('../util/error-handler.js'); 
const {ValidationException, ResourceNotFoundException, InternalServerException} = require('../util/exceptions.js');
const {CompletedResponse} = require('../util/response.js');
const db = require('../util/sqlconnector.js');
const genUUID = require('../util/util.js');

class WellnessHandler extends Handler {
  async handle(req) {
    try {
      await req.on('data', chunk => {super.accumulateChunkData(chunk);});
      await req.on('end', () => {});
      switch (req.method) {
        case "POST":
          return this.CreateWellness(req);
        case "GET":
          if (req.url.split('/').filter(Boolean).length == 3) {
            return this.GetWellness(req);
          } else {
            return this.ListWellness(req);
          }
        case "PUT":
          return this.UpdateWellness(req);
        case "DELETE":
          return this.DeleteWellness(req);
        default:
            throw new ValidationException("Invalid HTTP method");
      }
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  async CreateWellness(req) {
    try {
      const URL = req.url.split('/');
      const userID = URL[1];
      if (!userID) {
        throw new ValidationException("UserID Invalid");
      }
      var req_body = JSON.parse(this.postValue, this.#validateJson());

      if (!req_body.date || !req_body.mood || !req_body.stress || !req_body.sleep || !req_body.motivation || !req_body.hydration || !req_body.soreness) {
        throw new ValidationException("Bad Request: Missing Fields");
      }
      
    const ValidMood = ['worst', 'worse', 'normal', 'better', 'best'];
    const ValidStress = ['extreme', 'high', 'moderate', 'mild', 'relaxed'];
    const ValidSleep = ['terrible', 'poor', 'fair', 'good', 'excellent'];
    const ValidMotivation = ['lowest', 'lower', 'normal', 'higher', 'highest'];
    const ValidHydration = ['brown', 'orange', 'yellow', 'light', 'clear'];
    const ValidSoreness = ['severe', 'strong', 'moderate', 'mild', 'none'];

    if(
      !ValidMood.includes(req_body.mood) ||
      !ValidStress.includes(req_body.stress) ||
      !ValidSleep.includes(req_body.sleep) ||
      !ValidMotivation.includes(req_body.motivation) ||
      !ValidHydration.includes(req_body.hydration) ||
      !ValidSoreness.includes(req_body.soreness)
    ) {
        throw new ValidationException("Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness");
    }
      
          var wellnessID = genUUID.generateShortUUID();
          const connectionDB = await db.connection;
          const query = "INSERT INTO wellness VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          await connectionDB.query(query, [wellnessID, userID, req_body.date, req_body.mood, req_body.stress, req_body.sleep, req_body.motivation, req_body.hydration, req_body.soreness]);
        
          return new CompletedResponse(`New Wellness ID: ${wellnessID}`, "text/plain");
    } catch (error) {
        return errorHandler.handleError(error);
    }
  }

  async ListWellness(req) {
    try {
    const URL = req.url.split('/');
    const userID = URL[1];
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
      
async GetWellness(req) {
    try {
      const URL = req.url.split('/');
      const userID = URL[1];
      const wellnessID = URL[3];
  
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

  async UpdateWellness(req) {
    try {
    const URL = req.url.split('/');
    const userID = URL[1];
    const wellnessID = URL[3];
    
      if(!userID || !wellnessID) {
        throw new ValidationException("UserID or WellnessID Invalid");
    }

    var req_body = JSON.parse(this.postValue);

    const updatedFields = [];
    const ValidMood = ['worst', 'worse', 'normal', 'better', 'best'];
    const ValidStress = ['extreme', 'high', 'moderate', 'mild', 'relaxed'];
    const ValidSleep = ['terrible', 'poor', 'fair', 'good', 'excellent'];
    const ValidMotivation = ['lowest', 'lower', 'normal', 'higher', 'highest'];
    const ValidHydration = ['brown', 'orange', 'yellow', 'light', 'clear'];
    const ValidSoreness = ['severe', 'strong', 'moderate', 'mild', 'none'];

    if(req_body.mood && !ValidMood.includes(req_body.mood)){
        throw new ValidationException("Bad Request: Invalid Mood");
    }
    if(req_body.stress && !ValidStress.includes(req_body.stress)){
      throw new ValidationException("Bad Request: Invalid Stress");
    }
    if(req_body.sleep && !ValidSleep.includes(req_body.sleep)){
      throw new ValidationException("Bad Request: Invalid Sleep");
    }
    if(req_body.motivation && !ValidMotivation.includes(req_body.motivation)){
      throw new ValidationException("Bad Request: Invalid Motivation");
    }
    if(req_body.hydration && !ValidHydration.includes(req_body.hydration)){
      throw new ValidationException("Bad Request: Invalid Hydration");
    }
    if(req_body.soreness && !ValidSoreness.includes(req_body.soreness)){
      throw new ValidationException("Bad Request: Invalid Soreness");
    }

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

  async DeleteWellness(req) {
    try {
      const URL = req.url.split('/');
      const userID = URL[1];
      const wellnessID = URL[3];
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
