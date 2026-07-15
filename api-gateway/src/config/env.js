import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.API_GATEWAY_PORT || process.env.PORT || 8080),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:4002",
  adminServiceUrl: process.env.ADMIN_SERVICE_URL || "http://localhost:4003"
};
