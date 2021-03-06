class ErrorHandling extends Error {
  constructor(statusCode, message, errors) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

module.exports = ErrorHandling;
