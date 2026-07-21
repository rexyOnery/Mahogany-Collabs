import { ApiError } from "./errors.js";

export const validate = (schema, property = "body") => (req, res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    return next(
      new ApiError(
        400,
        "Validation failed",
        result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      )
    );
  }

  req[property] = result.data;
  return next();
};
