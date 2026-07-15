import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";

test("user service exposes a port and mongo URI", () => {
  assert.equal(typeof env.port, "number");
  assert.ok(env.mongoUri.includes("archive"));
});
