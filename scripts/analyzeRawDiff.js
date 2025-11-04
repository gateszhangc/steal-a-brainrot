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

const originalPath = path.join(screenshotDir, "original.png");
const clonePath = path.join(screenshotDir, "clone.png");

function readPng(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${path.relative(projectRoot, filePath)}`);
  }
  const buffer = fs.readFileSync(filePath);
  return PNG.sync.read(buffer);
}

function main() {
  const original = readPng(originalPath);
  const clone = readPng(clonePath);

  if (original.width !== clone.width || original.height !== clone.height) {
    throw new Error("Screenshots must have matching dimensions.");
  }

  const diff = new PNG({ width: original.width, height: original.height });
  const differingPixels = pixelmatch(
    original.data,
    clone.data,
    diff.data,
    original.width,
    original.height,
    { threshold: 0.1, includeAA: true }
  );

  if (differingPixels === 0) {
    console.log("Images are identical — no differing region.");
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < diff.height; y += 1) {
    for (let x = 0; x < diff.width; x += 1) {
      const idx = (y * diff.width + x) * 4;
      const alpha = diff.data[idx + 3];
      if (alpha !== 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log("Differing pixels:", differingPixels);
  console.log("Bounding box (inclusive):");
  console.log(`  top-left: (${minX}, ${minY})`);
  console.log(`  bottom-right: (${maxX}, ${maxY})`);
  console.log(`  width: ${maxX - minX + 1}`);
  console.log(`  height: ${maxY - minY + 1}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
