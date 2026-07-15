import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";

test("auth service exposes a port and JWT expiry", () => {
  assert.equal(typeof env.port, "number");
  assert.ok(env.jwtExpiresIn);
});
