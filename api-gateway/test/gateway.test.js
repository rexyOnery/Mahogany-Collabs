import test from "node:test";
import assert from "node:assert/strict";
import {
  isPublicAdminGet,
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
