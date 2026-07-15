import jwt from "jsonwebtoken";
import { forbidden, unauthorized } from "@archive/shared";
import { env } from "../config/env.js";

export const requireAuth = (req, res, next) => {
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

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return next(forbidden(`${role} role is required`));
  }

  return next();
};

export const attachIdentityHeaders = (proxyReq, req) => {
  if (!req.user) {
    return;
  }

  proxyReq.setHeader("x-user-id", req.user.sub);
  proxyReq.setHeader("x-user-email", req.user.email);
  proxyReq.setHeader("x-user-role", req.user.role || "user");
};
