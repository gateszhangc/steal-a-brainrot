#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const headHtml = fs.readFileSync(
  path.join(projectRoot, "data", "the-new-steal-brainrot-super-clicker-head.html"),
  "utf8"
);
const bodyHtml = fs.readFileSync(
  path.join(projectRoot, "data", "the-new-steal-brainrot-super-clicker-body.html"),
  "utf8"
);

const combinedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
${headHtml}
</head>
<body>
${bodyHtml}
</body>
</html>`;

fs.writeFileSync(
  path.join(projectRoot, "public", "original-the-new-steal-brainrot-super-clicker.html"),
  combinedHtml,
  "utf8"
);

console.log(
  `Generated combined HTML for original-the-new-steal-brainrot-super-clicker.html (${combinedHtml.length} chars).`
);