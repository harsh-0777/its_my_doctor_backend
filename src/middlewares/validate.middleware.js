import ApiError from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

// Usage: validate(schema) — schema is a Joi or Zod schema
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((d) => d.message);
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Validation failed.", errors);
  }

  next();
};
