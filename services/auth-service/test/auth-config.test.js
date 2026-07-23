import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";
import { signAccessToken, verifyAccessToken } from "../src/services/token.service.js";
import { registerSchema } from "../src/validation/auth.validation.js";

test("auth service exposes a port and JWT expiry", () => {
  assert.equal(typeof env.port, "number");
  assert.ok(env.jwtExpiresIn);
});

test("public registration rejects explicit admin accounts", () => {
  const result = registerSchema.safeParse({
    name: "Archive Admin",
    email: "admin@example.com",
    password: "secure-password",
    role: "admin"
  });

  assert.equal(result.success, false);
});

test("access tokens preserve admin role for protected upload routes", () => {
  const token = signAccessToken({
    _id: { toString: () => "admin-user-id" },
    email: "admin@example.com",
    role: "admin",
    name: "Archive Admin"
  });

  const payload = verifyAccessToken(token);
  assert.equal(payload.sub, "admin-user-id");
  assert.equal(payload.email, "admin@example.com");
  assert.equal(payload.role, "admin");
  assert.equal(payload.name, "Archive Admin");
});
