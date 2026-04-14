import { asyncHandler, ApiError, verifyAccessToken } from "../utils/index.js";
import { AUTH_MESSAGES } from "../constants/index.js";

// verifyAccessToken throws JsonWebTokenError / TokenExpiredError on failure.
// Both are caught by asyncHandler → next(err) → normalizeError in errorHandler.
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw ApiError.unauthorized(AUTH_MESSAGES.UNAUTHORIZED);
  }

  const decoded = verifyAccessToken(authHeader.split(" ")[1]);
  req.user = decoded;
  next();
});
