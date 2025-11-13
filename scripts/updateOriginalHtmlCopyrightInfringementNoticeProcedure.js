#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Read the head and body fragments that were already extracted and processed
const headHtml = fs.readFileSync(
  path.join(projectRoot, "data", "copyright-infringement-notice-procedure-head.html"),
  "utf8"
);
const bodyHtml = fs.readFileSync(
  path.join(projectRoot, "data", "copyright-infringement-notice-procedure-body.html"),
  "utf8"
);

// Combine into a complete HTML document
const fullHtml = `<!DOCTYPE html>
<html lang="en-US">
<head>
${headHtml}
</head>
<body>
${bodyHtml}
</body>
</html>`;

// Write to public directory for comparison
fs.writeFileSync(
  path.join(projectRoot, "public", "copyright-infringement-notice-procedure-original.html"),
  fullHtml,
  "utf8"
);

console.log(
  `Generated complete HTML snapshot at public/copyright-infringement-notice-procedure-original.html (${fullHtml.length} chars)`
);