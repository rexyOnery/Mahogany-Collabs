import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.USER_SERVICE_PORT || process.env.PORT || 4002),
  mongoUri: process.env.USER_MONGO_URI || "mongodb://localhost:27017/archive_users",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080"
};
