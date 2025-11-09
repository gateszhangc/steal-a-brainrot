#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const screenshotDir = path.join(projectRoot, "screenshots");

const viewport = { width: 1440, height: 900 };
const launchOptions = {
  headless: true
};

async function capture(url, output) {
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport,
    javaScriptEnabled: false,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.waitForTimeout(1_000);
  await page.screenshot({ path: output, fullPage: true });
  await browser.close();
}

async function main() {
  await fs.mkdir(screenshotDir, { recursive: true });

  const originalPath = path.join(screenshotDir, "original-plants-vs-brainrots.png");
  const clonePath = path.join(screenshotDir, "clone-plants-vs-brainrots.png");

  console.log("Capturing remote plants-vs-brainrots page…");
  await capture("https://steal-brainrot.io/plants-vs-brainrots", originalPath);

  console.log("Capturing local plants-vs-brainrots clone…");
  await capture("http://127.0.0.1:3000/plants-vs-brainrots", clonePath);

  console.log("Saved screenshots:");
  console.log(` - ${path.relative(projectRoot, originalPath)}`);
  console.log(` - ${path.relative(projectRoot, clonePath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});