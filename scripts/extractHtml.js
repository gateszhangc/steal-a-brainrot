#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const sourcePath = path.join(projectRoot, "steal-brainrot_home.html");

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing ${sourcePath}. Run the web fetch step first.`);
  process.exit(1);
}

const html = fs.readFileSync(sourcePath, "utf8");
const lower = html.toLowerCase();

const headStart = lower.indexOf("<head>");
const headEnd = lower.indexOf("</head>");

if (headStart === -1 || headEnd === -1) {
  console.error("Failed to locate <head> block in HTML source.");
  process.exit(1);
}

const bodyStartTag = lower.indexOf("<body");
const bodyOpen = bodyStartTag === -1 ? -1 : lower.indexOf(">", bodyStartTag);

if (bodyStartTag === -1 || bodyOpen === -1) {
  console.error("Failed to locate <body> block in HTML source.");
  process.exit(1);
}

const bodyCloseCandidate = lower.lastIndexOf("</body>");
const bodyEnd = bodyCloseCandidate !== -1 ? bodyCloseCandidate : html.length;

const ABSOLUTE_ORIGIN = "https://steal-brainrot.io";

const rewriteRootRelative = (fragment) =>
  fragment
    .replace(
      /\b(href|src|data-src|data-href|data-url|data-image|data-bg|data-background|content)=["']\/(?!\/)([^"'?#]+(?:[?#][^"']*)?)["']/gi,
      (_match, attr, rest) => {
      const normalized = rest.replace(/^\/+/, "");
      return `${attr}="${ABSOLUTE_ORIGIN}/${normalized}"`;
      }
    )
    .replace(/url\((['"]?)\/(?!\/)([^)'"]+)\1\)/gi, (_match, quote, rest) => {
      const normalized = rest.replace(/^\/+/, "");
      return `url(${quote}${ABSOLUTE_ORIGIN}/${normalized}${quote})`;
    });

const headHtml = rewriteRootRelative(
  html.slice(headStart + "<head>".length, headEnd)
);
const bodyHtml = rewriteRootRelative(html.slice(bodyOpen + 1, bodyEnd));

fs.writeFileSync(path.join(projectRoot, "data", "home-head.html"), headHtml, "utf8");
fs.writeFileSync(path.join(projectRoot, "data", "home-body.html"), bodyHtml, "utf8");

console.log(
  `Extracted head (${headHtml.length} chars) and body (${bodyHtml.length} chars) fragments to data/home-head.html and data/home-body.html.`
);
