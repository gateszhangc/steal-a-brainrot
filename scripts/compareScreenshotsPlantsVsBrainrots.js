#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const screenshotDir = path.join(projectRoot, "screenshots");

const originalPath = path.join(screenshotDir, "original-plants-vs-brainrots.png");
const clonePath = path.join(screenshotDir, "clone-plants-vs-brainrots.png");
const diffPath = path.join(screenshotDir, "diff-plants-vs-brainrots.png");

function readPng(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${path.relative(projectRoot, filePath)}`);
  }
  const buffer = fs.readFileSync(filePath);
  return PNG.sync.read(buffer);
}

function assertSameSize(a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error(
      `Image dimensions differ: (${a.width}x${a.height}) vs (${b.width}x${b.height})`
    );
  }
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function main() {
  const original = readPng(originalPath);
  const clone = readPng(clonePath);

  assertSameSize(original, clone);

  const diff = new PNG({ width: original.width, height: original.height });
  const differingPixels = pixelmatch(
    original.data,
    clone.data,
    diff.data,
    original.width,
    original.height,
    { threshold: 0.1, includeAA: true }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = original.width * original.height;
  const ratio = differingPixels / totalPixels;

  console.log("Plants vs Brainrots Pixel diff results");
  console.log("------------------");
  console.log(`Differing pixels: ${differingPixels} / ${totalPixels}`);
  console.log(`Difference: ${formatPercent(ratio)}`);
  console.log(`Saved diff overlay to ${path.relative(projectRoot, diffPath)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}