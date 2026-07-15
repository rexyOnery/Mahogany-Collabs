import test from "node:test";
import assert from "node:assert/strict";
import { ApiError } from "../src/index.js";

test("ApiError stores status code and details", () => {
  const error = new ApiError(418, "Short and stout", [{ field: "teapot" }]);

  assert.equal(error.statusCode, 418);
  assert.equal(error.message, "Short and stout");
  assert.deepEqual(error.details, [{ field: "teapot" }]);
});
