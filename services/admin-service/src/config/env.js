import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.ADMIN_SERVICE_PORT || process.env.PORT || 4003),
  mongoUri: process.env.ADMIN_MONGO_URI || "mongodb://localhost:27017/archive_admin",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080",
  archiveUploadDir: process.env.ARCHIVE_UPLOAD_DIR || "uploads/archive-items",
  archiveImageMaxBytes: Number(process.env.ARCHIVE_IMAGE_MAX_BYTES || 10 * 1024 * 1024)
};
