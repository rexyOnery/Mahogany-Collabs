import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";

test("gateway has service URLs configured", () => {
  assert.ok(env.authServiceUrl);
  assert.ok(env.userServiceUrl);
  assert.ok(env.adminServiceUrl);
});
