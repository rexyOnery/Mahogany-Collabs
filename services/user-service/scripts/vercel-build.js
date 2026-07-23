/**
 * Vercel Build Script for User Service
 *
 * Bundles the Express app into a single serverless function for Vercel.
 * @archive/shared is a local file dependency resolved from ./shared.
 *
 * Usage: node scripts/vercel-build.js
 */

import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, "..");
const OUTPUT_DIR = resolve(ROOT, ".vercel", "output", "static", "api");

mkdirSync(OUTPUT_DIR, { recursive: true });

const esbuild = await import("esbuild");
const result = await esbuild.build({
  entryPoints: [resolve(ROOT, "api", "index.js")],
  outfile: resolve(OUTPUT_DIR, "index.js"),
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  sourcemap: false,
  minify: true,
  external: [
    "express",
    "cors",
    "helmet",
    "morgan",
    "jsonwebtoken",
    "dotenv",
    "mongoose",
    "zod"
  ]
});

if (result.errors && result.errors.length > 0) {
  console.error("✖ esbuild errors:", JSON.stringify(result.errors, null, 2));
  process.exit(1);
}

console.log("\u2705 User Service bundled for Vercel serverless deployment");
console.log(`   Output: ${resolve(OUTPUT_DIR, "index.js")}`);
