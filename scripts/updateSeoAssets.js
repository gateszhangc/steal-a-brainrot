#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

const REMOTE_ORIGIN = "https://steal-brainrot.io";
const CLONE_ORIGIN = (process.env.CLONE_ORIGIN ?? "https://www.stealabrainrot.quest").replace(/\/$/, "");

const targets = [
  {
    url: "https://steal-brainrot.io/robots.txt",
    fileName: "robots.txt",
    replaceDomain: true
  },
  {
    url: "https://steal-brainrot.io/sitemap.xml",
    fileName: "sitemap.xml",
    replaceDomain: true
  }
];

async function downloadAsset(target) {
  const response = await fetch(target.url);

  if (!response.ok) {
    throw new Error(`Failed to download ${target.url}: ${response.status} ${response.statusText}`);
  }

  const rawContent = await response.text();
  let content = target.replaceDomain
    ? rawContent.replaceAll(REMOTE_ORIGIN, CLONE_ORIGIN)
    : rawContent;

  if (target.fileName === "robots.txt") {
    const sitemapLine = `Sitemap: ${CLONE_ORIGIN}/sitemap.xml`;
    if (content.includes("Sitemap:")) {
      content = content.replace(/Sitemap:[^\r\n]*/gi, sitemapLine);
    } else {
      const trimmed = content.trimEnd();
      const newline = trimmed.endsWith("\n") ? "" : "\n";
      content = `${trimmed}${newline}${sitemapLine}\n`;
    }
  }
  const outputPath = path.join(publicDir, target.fileName);
  await fs.writeFile(outputPath, content, "utf8");
  return outputPath;
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true });

  for (const target of targets) {
    try {
      const outputPath = await downloadAsset(target);
      console.log(`Wrote ${path.relative(projectRoot, outputPath)} from ${target.url}`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
