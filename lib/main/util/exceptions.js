class ValidationException extends Error {
    constructor(message) {
      super(message);
    }
}

class ResourceNotFoundException extends Error {
    constructor(message) {
      super(message);
    }
}

class InternalServerException extends Error {
    constructor(message) {
      super(message);
    }
}

class ConflictException extends Error {
    constructor(message) {
      super(message);
    }
}

class AccessDeniedException extends Error {
    constructor(message) {
      super(message);
    }
}

module.exports = {
    ValidationException,
    ResourceNotFoundException,
    InternalServerException,
    ConflictException,
    AccessDeniedException

}