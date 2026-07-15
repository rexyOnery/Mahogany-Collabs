import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { seedArchiveData } from "./services/archive.service.js";
import { logger } from "@archive/shared";

try {
  await connectDb();
  await seedArchiveData();
  app.listen(env.port, () => {
    logger.info("Admin Service listening", { port: env.port });
  });
} catch (error) {
  logger.error("Admin Service failed to start", { error: error.message });
  process.exit(1);
}
