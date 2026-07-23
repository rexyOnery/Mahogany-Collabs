export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export const unauthorized = (message = "Authentication is required") =>
  new ApiError(401, message);

export const forbidden = (message = "You do not have access to this resource") =>
  new ApiError(403, message);

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};

const format = (level, message, meta = {}) =>
  JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta
  });

export const logger = {
  info(message, meta) {
    console.log(format("info", message, meta));
  },
  warn(message, meta) {
    console.warn(format("warn", message, meta));
  },
  error(message, meta) {
    console.error(format("error", message, meta));
  }
};
