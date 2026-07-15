import test from "node:test";
import assert from "node:assert/strict";
import { env } from "../src/config/env.js";
import { seedCollections } from "../src/data/seed-data.js";

test("admin service has seed collections", () => {
  assert.equal(typeof env.port, "number");
  assert.ok(seedCollections.length >= 5);
});
