const { ValidaitonError, ConflictError, ResourceNotFoundError, InternalServiceError} = require("./response.js");
const {ValidationException, ConflictException, ResourceNotFoundException, InternalServerException} = require("./exceptions.js");

const handleError = (e) => {
        var resp = null;
        if (e instanceof ValidationException) {
            resp = new ValidaitonError("Validation Exception:" + e);
        }
        else if (e instanceof ConflictException) {  
            resp = new ConflictError("Conflict Exception:" + e);
        }
        else if (e instanceof ResourceNotFoundException) {
            resp = new ResourceNotFoundError("Resource Not Found Exception :" + e);
        } else {
            resp = new InternalServiceError("Internal Service Exception "+ e);
            console.log(e.getMessage);
        }
        return resp;
    }
module.exports = {
    handleError
}