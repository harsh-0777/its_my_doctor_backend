import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

// Usage: authorize(ROLES.ADMIN, ROLES.DOCTOR)
export const authorize = (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGES.UNAUTHORIZED);
    }
    next();
  };
