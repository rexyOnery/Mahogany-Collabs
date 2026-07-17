import dotenv from "dotenv";

dotenv.config();

const defaultFrontendOrigin = "http://localhost:3000";

export const getAllowedOrigins = () => {
  const configured = (process.env.FRONTEND_URL || defaultFrontendOrigin)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set([...configured, "http://127.0.0.1:3000", "http://localhost:3000"])];
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_GATEWAY_PORT || process.env.PORT || 8090),
  frontendUrl: process.env.FRONTEND_URL || defaultFrontendOrigin,
  allowedOrigins: getAllowedOrigins(),
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:4002",
  adminServiceUrl: process.env.ADMIN_SERVICE_URL || "http://localhost:4003"
};
