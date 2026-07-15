import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.AUTH_SERVICE_PORT || process.env.PORT || 4001),
  mongoUri: process.env.AUTH_MONGO_URI || "mongodb://localhost:27017/archive_auth",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080"
};
