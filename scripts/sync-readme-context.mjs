#!/usr/bin/env node

/**
 * sync-readme-context.mjs
 *
 * Reads docs/context-log.md and injects its content into README.md
 * between the <!-- CONTEXT_LOG_START --> and <!-- CONTEXT_LOG_END --> markers.
 *
 * Usage:
 *   npm run sync:readme
 *   node scripts/sync-readme-context.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const README_PATH = resolve(root, "README.md");
const CONTEXT_LOG_PATH = resolve(root, "docs", "context-log.md");

const START_MARKER = "<!-- CONTEXT_LOG_START -->";
const END_MARKER = "<!-- CONTEXT_LOG_END -->";

function main() {
  // Read files
  let readme;
  let contextLog;

  try {
    readme = readFileSync(README_PATH, "utf-8");
  } catch {
    console.error("❌ Could not read README.md");
    process.exit(1);
  }

  try {
    contextLog = readFileSync(CONTEXT_LOG_PATH, "utf-8");
  } catch {
    console.error("❌ Could not read docs/context-log.md");
    process.exit(1);
  }

  // Find markers
  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error("❌ Could not find CONTEXT_LOG_START / CONTEXT_LOG_END markers in README.md");
    process.exit(1);
  }

  if (startIdx >= endIdx) {
    console.error("❌ START marker must come before END marker in README.md");
    process.exit(1);
  }

  // Build updated content
  const before = readme.slice(0, startIdx + START_MARKER.length);
  const after = readme.slice(endIdx);

  const injected = [
    "",
    "<!-- This section is auto-synced from docs/context-log.md -->",
    `<!-- Last synced: ${new Date().toISOString()} -->`,
    "",
    contextLog.trim(),
    "",
  ].join("\n");

  const updated = before + injected + after;

  // Write back
  writeFileSync(README_PATH, updated, "utf-8");
  console.log("✅ README.md updated with latest context from docs/context-log.md");
}

main();
