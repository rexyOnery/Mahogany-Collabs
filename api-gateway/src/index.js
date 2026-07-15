import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "@archive/shared";

app.listen(env.port, () => {
  logger.info("API Gateway listening", {
    port: env.port,
    authServiceUrl: env.authServiceUrl,
    userServiceUrl: env.userServiceUrl,
    adminServiceUrl: env.adminServiceUrl
  });
});
