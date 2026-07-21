/**
 * Vercel Build Script for Admin Service
 * 
 * On Vercel, npm install creates a symlink: node_modules/@archive/shared -> ../../shared
 * esbuild bundles the app with @archive/shared resolved from node_modules.
 * 
 * Usage: node scripts/vercel-build.js
 */

import { existsSync, mkdirSync, cpSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = resolve(__dirname, "..");
const OUTPUT_DIR = resolve(ROOT, ".vercel", "output", "static", "api");
const SHARED_DIR = resolve(ROOT, "shared");
const TMP_SHARED = resolve(ROOT, ".vercel", "shared");

console.log("=== Vercel Build Debug ===");
console.log("ROOT:", ROOT);
console.log("Output dir:", OUTPUT_DIR);
console.log("Shared dir:", SHARED_DIR);

// Verify shared module exists
if (!existsSync(resolve(SHARED_DIR, "package.json"))) {
  console.error("✖ Shared package.json not found at", SHARED_DIR);
  process.exit(1);
}
if (!existsSync(resolve(SHARED_DIR, "index.js"))) {
  console.error("✖ Shared index.js not found at", SHARED_DIR);
  process.exit(1);
}

// Check if node_modules/@archive/shared exists (symlink from npm install)
const nmShared = resolve(ROOT, "node_modules", "@archive", "shared");
console.log("node_modules/@archive/shared exists:", existsSync(nmShared));
if (existsSync(nmShared)) {
  console.log("node_modules/@archive/shared is symlink:", 
    // eslint-disable-next-line no-undef
    process.platform === "win32" ? "N/A" : existsSync(nmShared));
}

// Copy shared into .vercel/shared so esbuild can resolve it as a local path
if (existsSync(TMP_SHARED)) {
  rmSync(TMP_SHARED, { recursive: true });
}
mkdirSync(TMP_SHARED, { recursive: true });

cpSync(SHARED_DIR, TMP_SHARED, {
  recursive: true,
  filter: (src) => {
    if (src.includes("node_modules")) return false;
    return true;
  },
});

writeFileSync(
  resolve(TMP_SHARED, "package.json"),
  JSON.stringify({ name: "@archive/shared", type: "module", main: "./index.js" }, null, 2),
);

console.log("✓ Shared module prepared at", TMP_SHARED);

// Verify entry point
const entryPoint = resolve(ROOT, "api", "index.js");
if (!existsSync(entryPoint)) {
  console.error("✖ Entry point not found at", entryPoint);
  process.exit(1);
}
console.log("✓ Entry point:", entryPoint);

try {
  const esbuild = await import("esbuild");

  const result = await esbuild.build({
    entryPoints: [entryPoint],
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
    external: [
      "express",
      "cors",
      "helmet",
      "morgan",
      "jsonwebtoken",
      "dotenv",
      "mongoose",
      "multer",
      "sharp",
      "slugify",
      "zod"
    ],
  });

  if (result.errors && result.errors.length > 0) {
    console.error("✖ esbuild errors:");
    for (const err of result.errors) {
      console.error(`  - ${err.text}`);
      if (err.location) {
        console.error(`    at ${err.location.file}:${err.location.line}:${err.location.column}`);
      }
    }
    process.exit(1);
  }

  if (result.warnings && result.warnings.length > 0) {
    console.warn("⚠ esbuild warnings:");
    for (const warn of result.warnings) {
      console.warn(`  - ${warn.text}`);
    }
  }

  const outputFile = resolve(OUTPUT_DIR, "index.js");
  const stats = existsSync(outputFile) ? import("node:fs").then(m => m.statSync(outputFile)) : null;
  console.log("\u2705 Admin Service bundled for Vercel serverless deployment");
  console.log(`   Output: ${outputFile}`);
  
} catch (err) {
  console.error("✖ Build failed with exception:", err.message);
  if (err.errors) {
    for (const e of err.errors) {
      console.error(`  - ${e.text}`);
    }
  }
  console.error(err.stack);
  process.exit(1);
}
