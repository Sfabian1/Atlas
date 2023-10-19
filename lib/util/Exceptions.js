class ValidationException extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
}

class ResourceNotFoundException extends Error {
    constructor(message) {
      super(message);
      this.name = "ResourceNotFoundException";
    }
}

class InternalServerException extends Error {
    constructor(message) {
      super(message);
      this.name = "InternalServerException";
    }
}

class ConflictException extends Error {
    constructor(message) {
      super(message);
      this.name = "ConflictException";
    }
}

class AccessDeniedException extends Error {
    constructor(message) {
      super(message);
      this.name = "AccessDeniedException";
    }
}

module.exports = {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    ConflictException,
    AccessDeniedException

}