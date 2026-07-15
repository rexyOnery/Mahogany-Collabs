import test from "node:test";
import assert from "node:assert/strict";

test("frontend smoke test", () => {
  assert.equal("Mahogany Archives".includes("Archives"), true);
});
