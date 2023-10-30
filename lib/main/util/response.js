class ServerResponse {
    code;
    message;
    content_type;
    constructor(message, content_type) {
        if (this.constructor == ServerResponse) {
            throw new Error("default errors can't be instantiated.");
        }
        this.message = message;
        this.content_type = content_type
        if (this.content_type == null) {
           this.content_type = 'undefined';
        }
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
    
    getContentType() {
        return this.content_type;
    }
}

class ValidaitonError extends ServerResponse {
    constructor(message) {  
        super(message,'text/plain');      
        this.code = 400; 
    }
}

class InternalServiceError extends ServerResponse {
    constructor(message) {  
        super(message,'text/plain');      
        this.code = 500; 
    }
}

class ResourceNotFoundError extends ServerResponse {
    constructor(message) { 
        super(message, 'text/plain');      
        this.code = 404; 
    }
}

class HandlerNotImplementedError extends ServerResponse {    
    constructor() { 
        super("Error we dont support that content type\n " + 
        "we currently support:\n" +
        "text/csv\n" + 
        "text/plain\n" +
        "text/xml\n"+
        "application/json\n", 'text/plain');      
        this.code = 405; 
    }
}

class UnsupportedOperationError extends ServerResponse {
  
    constructor() { 
        super("Error we dont support GET,PUT,PATCH,DELETE functionality", 'text/plain');    
        this.code = 405; 
    }
}

class PreconditonFailedError extends ServerResponse {
    constructor(message) {
        super(message, 'text/plain');        
        this.code = 412; 
    }

}
class ConflictError extends ServerResponse {
    constructor(message) {
        super(message, 'text/plain');        
        this.code = 409; 
    }

}

class CompletedResponse extends ServerResponse {
    constructor(body, content_type) {
        super(body, content_type);        
        this.code = 200;
    }
}

module.exports = {
    PreconditonFailedError,
    ConflictError,
    UnsupportedOperationError,
    ResourceNotFoundError,
    ValidaitonError,
    HandlerNotImplementedError,
    CompletedResponse,
    InternalServiceError,
    CustomServerError: ServerResponse
}

