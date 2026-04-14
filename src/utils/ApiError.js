class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success   = false;
    this.errors    = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Static factory methods ───────────────────────────────────────────────
  static badRequest(message = "Bad request.", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized.") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Access denied.") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found.") {
    return new ApiError(404, message);
  }

  static conflict(message = "Resource already exists.") {
    return new ApiError(409, message);
  }

  static unprocessable(message = "Validation failed.", errors = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = "Internal server error.") {
    return new ApiError(500, message);
  }
}

export default ApiError;
