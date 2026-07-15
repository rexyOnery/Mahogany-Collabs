import app from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "@archive/shared";

try {
  await connectDb();
  app.listen(env.port, () => {
    logger.info("User Service listening", { port: env.port });
  });
} catch (error) {
  logger.error("User Service failed to start", { error: error.message });
  process.exit(1);
}
