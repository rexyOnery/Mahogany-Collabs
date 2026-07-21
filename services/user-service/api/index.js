// Vercel Serverless Function entry point for User Service
// Uses cached MongoDB connection for serverless environment
import mongoose from "mongoose";
import app from "../src/app.js";
import { env } from "../src/config/env.js";
import { logger } from "@archive/shared";

let cachedDb = null;

async function connectDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  cachedDb = mongoose.connection;

  logger.info("User database connected (Vercel serverless)");
  return cachedDb;
}

// Wrap the app to ensure DB is connected before handling requests
const handler = async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    logger.error("User service database connection failed", {
      error: error.message
    });
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable"
    });
  }
};

export default handler;

