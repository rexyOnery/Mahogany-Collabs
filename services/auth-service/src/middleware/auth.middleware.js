import { unauthorized } from "@archive/shared";
import { verifyAccessToken } from "../services/token.service.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(unauthorized());
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return next(unauthorized("Invalid or expired token"));
  }
};
