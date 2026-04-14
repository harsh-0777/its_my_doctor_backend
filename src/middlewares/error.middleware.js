import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const { JsonWebTokenError, TokenExpiredError } = jwt;

// ─── Normalize any error into a clean ApiError ────────────────────────────────

const normalizeError = (err) => {
  // Already our custom error — pass through
  if (err instanceof ApiError) return err;

  // Mongoose field validation failed (e.g. required, enum, minlength)
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiError.unprocessable("Validation failed.", errors);
  }

  // Mongoose invalid ObjectId (e.g. /doctors/not-an-id)
  if (err instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for field '${err.path}'.`);
  }

  // MongoDB duplicate key (unique index violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return ApiError.conflict(`'${field}' already exists.`);
  }

  // JWT invalid signature / malformed
  if (err instanceof JsonWebTokenError) {
    return ApiError.unauthorized("Invalid token. Please log in again.");
  }

  // JWT expired
  if (err instanceof TokenExpiredError) {
    return ApiError.unauthorized("Session expired. Please log in again.");
  }

  // Express body-parser: malformed JSON
  if (err instanceof SyntaxError && "body" in err) {
    return ApiError.badRequest("Malformed JSON in request body.");
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    return ApiError.badRequest(`File upload error: ${err.message}`);
  }

  // Fallback — unknown error
  return ApiError.internal(err.message);
};

// ─── 404 handler ─────────────────────────────────────────────────────────────

export const notFound = (req, res, next) => {
  next(
    ApiError.notFound(`Route '${req.method} ${req.originalUrl}' not found.`),
  );
};

// ─── Global error handler ─────────────────────────────────────────────────────

export const errorHandler = (err, req, res, next) => {
  const normalized = normalizeError(err);

  // Log server errors (5xx) always; log client errors (4xx) only in dev
  if (normalized.statusCode >= 500) {
    logger.error(normalized.message, {
      stack: err.stack,
      url: req.originalUrl,
    });
  } else if (config.NODE_ENV === "development") {
    logger.warn(normalized.message, { url: req.originalUrl });
  }

  res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    errors: normalized.errors,
    ...(config.NODE_ENV === "development" && { stack: err.stack }),
  });
};
