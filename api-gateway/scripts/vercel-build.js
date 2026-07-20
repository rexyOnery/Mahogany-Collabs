/**
 * Vercel Build Script for API Gateway
 *
 * Bundles the Express gateway and the local @archive/shared dependency
 * into a single serverless function file that Vercel can deploy.
 *
 * Steps:
 *   1. Copy @archive/shared sources into a temporary directory
 *   2. Use esbuild to bundle api/index.js + all imports into one output file
 *   3. Output to .vercel/output/static/api/index.js
 *
 * Usage: node scripts/vercel-build.js
 */

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, "..");
const SHARED_SRC = resolve(ROOT, "..", "shared", "src");
const TMP_SHARED = resolve(ROOT, ".vercel", "shared");
const OUTPUT_DIR = resolve(ROOT, ".vercel", "output", "static", "api");

// --------------------------------------------------------------------------
// 1. Prepare @archive/shared locally so esbuild can resolve it
// --------------------------------------------------------------------------
if (existsSync(TMP_SHARED)) {
  rmSync(TMP_SHARED, { recursive: true });
}
mkdirSync(TMP_SHARED, { recursive: true });

cpSync(SHARED_SRC, TMP_SHARED, {
  recursive: true,
  filter: (src) => {
    if (src.includes("node_modules") || src.includes("test")) return false;
    return true;
  },
});

writeFileSync(
  resolve(TMP_SHARED, "package.json"),
  JSON.stringify({ name: "@archive/shared", type: "module", main: "./index.js" }, null, 2),
);

// --------------------------------------------------------------------------
// 2. Bundle with esbuild
// --------------------------------------------------------------------------
const esbuild = await import("esbuild");

await esbuild.build({
  entryPoints: [resolve(ROOT, "api", "index.js")],
  outfile: resolve(OUTPUT_DIR, "index.js"),
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  alias: {
    "@archive/shared": TMP_SHARED,
  },
  sourcemap: false,
  minify: true,
  // Exclude these — Vercel Node.js runtime provides them
  external: [
    "express",
    "cors",
    "helmet",
    "morgan",
    "http-proxy-middleware",
    "express-rate-limit",
    "jsonwebtoken",
    "dotenv",
  ],
});

console.log("\u2705 API Gateway bundled for Vercel serverless deployment");
console.log(`   Output: ${resolve(OUTPUT_DIR, "index.js")}`);

