import test from "node:test";
import assert from "node:assert/strict";
import {
  isPublicAdminGet,
  isPublicArchiveImageRequest,
  normalizeProxyResponseHeaders,
  stripUpstreamCorsHeaders
} from "../src/app.js";
import { env, getAllowedOrigins } from "../src/config/env.js";

test("gateway has service URLs configured", () => {
  assert.ok(env.authServiceUrl);
  assert.ok(env.userServiceUrl);
  assert.ok(env.adminServiceUrl);
});

test("archive item reads are public admin gateway routes", () => {
  assert.equal(
    isPublicAdminGet({ method: "GET", originalUrl: "/api/admin/items?search=portrait" }),
    true
  );
  assert.equal(
    isPublicAdminGet({ method: "GET", originalUrl: "/api/admin/items/family-portrait" }),
    true
  );
  assert.equal(
    isPublicAdminGet({ method: "POST", originalUrl: "/api/admin/items" }),
    false
  );
  assert.equal(
    isPublicAdminGet({
      method: "HEAD",
      originalUrl: "/api/admin/items/family-portrait/image"
    }),
    true
  );
});

test("gateway allows localhost origins for frontend development", () => {
  const origins = getAllowedOrigins();
  assert.ok(origins.includes("http://localhost:3000"));
  assert.ok(origins.includes("http://127.0.0.1:3000"));
});

test("gateway owns CORS headers on proxied responses", () => {
  const proxyRes = {
    headers: {
      "access-control-allow-origin": "http://localhost:8080",
      "access-control-allow-credentials": "true",
      "content-type": "application/json"
    }
  };

  stripUpstreamCorsHeaders(proxyRes);

  assert.deepEqual(proxyRes.headers, {
    "content-type": "application/json"
  });
});

test("public archive images can be embedded by the frontend origin", () => {
  const proxyRes = {
    headers: {
      "access-control-allow-origin": "http://localhost:3000",
      "cross-origin-resource-policy": "same-origin",
      "content-type": "image/png"
    }
  };
  const request = {
    method: "GET",
    originalUrl: "/api/admin/items/family-portrait/image"
  };

  assert.equal(isPublicArchiveImageRequest(request), true);
  normalizeProxyResponseHeaders(proxyRes, request);

  assert.deepEqual(proxyRes.headers, {
    "cross-origin-resource-policy": "cross-origin",
    "content-type": "image/png"
  });
});

test("non-image API responses retain their resource policy", () => {
  const proxyRes = {
    headers: {
      "cross-origin-resource-policy": "same-origin",
      "content-type": "application/json"
    }
  };

  normalizeProxyResponseHeaders(proxyRes, {
    method: "GET",
    originalUrl: "/api/admin/items/family-portrait"
  });

  assert.equal(proxyRes.headers["cross-origin-resource-policy"], "same-origin");
});
