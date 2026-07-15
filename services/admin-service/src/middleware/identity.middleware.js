import jwt from "jsonwebtoken";
import { forbidden, unauthorized } from "@archive/shared";
import { env } from "../config/env.js";

export const requireIdentity = (req, res, next) => {
  const gatewayUserId = req.headers["x-user-id"];

  if (gatewayUserId) {
    req.user = {
      sub: gatewayUserId,
      email: req.headers["x-user-email"],
      role: req.headers["x-user-role"] || "user"
    };
    return next();
  }

  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(unauthorized());
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return next(unauthorized("Invalid or expired token"));
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(forbidden("Admin role is required"));
  }

  return next();
};
