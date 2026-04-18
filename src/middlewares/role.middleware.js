import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { ROLES } from "../constants/roles.js";

// Usage: authorize(ROLES.ADMIN, ROLES.DOCTOR)
// super_admin always passes — they have platform-wide access.
export const authorize = (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGES.UNAUTHORIZED);
    }
    if (req.user.role === ROLES.SUPER_ADMIN) return next();
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, AUTH_MESSAGES.UNAUTHORIZED);
    }
    next();
  };
