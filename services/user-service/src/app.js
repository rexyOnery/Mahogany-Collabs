import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "@archive/shared";
import { env } from "./config/env.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "user-service",
    status: "healthy",
    uptime: process.uptime()
  });
});

app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "User route not found"
  });
});

app.use(errorHandler);

export default app;
