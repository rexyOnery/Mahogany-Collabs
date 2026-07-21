export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const notFound = (resource = "Resource") =>
  new ApiError(404, `${resource} was not found`);

export const unauthorized = (message = "Authentication is required") =>
  new ApiError(401, message);

export const forbidden = (message = "You do not have access to this resource") =>
  new ApiError(403, message);
