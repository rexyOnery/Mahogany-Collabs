// Vercel Serverless Function entry point for Admin Service
// Uses cached MongoDB connection for serverless environment
import mongoose from "mongoose";
import app from "../src/app.js";
import { env } from "../src/config/env.js";
import { ensureAdminIndexes } from "../src/config/db.js";
import { seedArchiveData } from "../src/services/archive.service.js";
import { logger } from "@archive/shared";

let cachedDb = null;
let initialised = false;

async function connectDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  mongoose.set("strictQuery", true);
  mongoose.set("autoIndex", false);
  await mongoose.connect(env.mongoUri);
  cachedDb = mongoose.connection;

  logger.info("Admin database connected (Vercel serverless)");
  return cachedDb;
}

async function initialiseAdminService() {
  if (initialised) return;

  try {
    await ensureAdminIndexes();
    await seedArchiveData();
    initialised = true;
    logger.info("Admin service initialised (indexes + seed data)");
  } catch (error) {
    logger.error("Admin service initialisation failed", {
      error: error.message
    });
  }
}

// Wrap the app to ensure DB is connected before handling requests
const handler = async (req, res) => {
  try {
    await connectDatabase();
    // Fire-and-forget initialisation (non-blocking for first request)
    if (!initialised) {
      initialiseAdminService().catch((err) =>
        logger.error("Async admin init failed", { error: err.message })
      );
    }
    return app(req, res);
  } catch (error) {
    logger.error("Admin service database connection failed", {
      error: error.message
    });
    res.status(503).json({
      success: false,
      message: "Service temporarily unavailable"
    });
  }
};

export default handler;

