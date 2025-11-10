#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const sourcePath = path.join(projectRoot, "steal-brainrot_merge-rot.html");
const headPath = path.join(projectRoot, "data", "merge-rot-head.html");
const bodyPath = path.join(projectRoot, "data", "merge-rot-body.html");
const outputPath = path.join(projectRoot, "public", "original-merge-rot.html");

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing ${sourcePath}. Run the fetch step first.`);
  process.exit(1);
}

if (!fs.existsSync(headPath) || !fs.existsSync(bodyPath)) {
  console.error("Missing extracted fragments. Run scripts/extractHtmlmerge-rot.js first.");
  process.exit(1);
}

const originalHtml = fs.readFileSync(sourcePath, "utf8");
const lower = originalHtml.toLowerCase();

const htmlOpenIndex = lower.indexOf("<html");
const htmlOpenEnd = htmlOpenIndex === -1 ? -1 : lower.indexOf(">", htmlOpenIndex);

const docPreamble =
  htmlOpenIndex > 0 ? originalHtml.slice(0, htmlOpenIndex).trim() : "<!DOCTYPE html>";

let attributeString = "";

if (htmlOpenIndex !== -1 && htmlOpenEnd !== -1) {
  attributeString = originalHtml
    .slice(htmlOpenIndex + "<html".length, htmlOpenEnd)
    .trim();
}

const headHtml = fs.readFileSync(headPath, "utf8");
const bodyHtml = fs.readFileSync(bodyPath, "utf8");

const combined = [
  docPreamble,
  `<html${attributeString.length > 0 ? ` ${attributeString}` : ""}>`,
  "<head>",
  headHtml,
  "</head>",
  "<body>",
  bodyHtml,
  "</body>",
  "</html>",
  ""
].join("\n");

fs.writeFileSync(outputPath, combined, "utf8");

console.log(`Wrote snapshot to ${path.relative(projectRoot, outputPath)}.`);
