import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import {
  createProxyMiddleware,
  fixRequestBody
} from "http-proxy-middleware";
import { errorHandler, logger } from "@archive/shared";
import { env } from "./config/env.js";
import {
  attachIdentityHeaders,
  requireAuth,
  requireRole
} from "./middleware/auth.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.allowedOrigins,
    credentials: true
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: (req) => req.path === "/health",
    handler: (req, res, next, options) =>
      res.status(options.statusCode).json({
        success: false,
        message: "Too many requests. Please wait a few minutes and try again."
      })
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

export const stripUpstreamCorsHeaders = (proxyRes) => {
  for (const header of Object.keys(proxyRes.headers || {})) {
    if (header.toLowerCase().startsWith("access-control-")) {
      delete proxyRes.headers[header];
    }
  }
};

export const isPublicArchiveImageRequest = (req) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    return false;
  }

  const path = req.originalUrl.split("?")[0];
  return /^\/api\/admin\/items\/[^/]+\/image$/.test(path);
};

export const normalizeProxyResponseHeaders = (proxyRes, req) => {
  stripUpstreamCorsHeaders(proxyRes);

  if (isPublicArchiveImageRequest(req)) {
    proxyRes.headers["cross-origin-resource-policy"] = "cross-origin";
  }
};

const proxy = (target, servicePrefix) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `${servicePrefix}${path}`,
    on: {
      proxyRes(proxyRes, req) {
        normalizeProxyResponseHeaders(proxyRes, req);
      },
      proxyReq(proxyReq, req) {
        attachIdentityHeaders(proxyReq, req);
        fixRequestBody(proxyReq, req);
      },
      error(error, req, res) {
        logger.error("Proxy request failed", {
          target,
          path: req.originalUrl,
          error: error.message
        });
        res.status(502).json({
          success: false,
          message: "Upstream service is unavailable"
        });
      }
    }
  });

export const isPublicAdminGet = (req) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    return false;
  }

  const path = req.originalUrl.split("?")[0];
  return [
    /^\/api\/admin\/items(\/.*)?$/,
    /^\/api\/admin\/collections(\/.*)?$/,
    /^\/api\/admin\/resources$/,
    /^\/api\/admin\/community$/
  ].some((pattern) => pattern.test(path));
};

const protectAdminWhenNeeded = (req, res, next) => {
  if (isPublicAdminGet(req)) {
    return next();
  }

  return requireAuth(req, res, (authError) => {
    if (authError) {
      return next(authError);
    }
    return requireRole("admin")(req, res, next);
  });
};

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "api-gateway",
    status: "healthy",
    uptime: process.uptime()
  });
});

app.use("/api/auth", proxy(env.authServiceUrl, "/auth"));
app.use("/api/users", requireAuth, proxy(env.userServiceUrl, "/users"));
app.use(
  "/api/admin",
  protectAdminWhenNeeded,
  proxy(env.adminServiceUrl, "/admin")
);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Gateway route not found"
  });
});

app.use(errorHandler);

export default app;
