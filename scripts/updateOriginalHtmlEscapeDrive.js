#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const headHtml = fs.readFileSync(
  path.join(projectRoot, "data", "escape-drive-head.html"),
  "utf8"
);
const bodyHtml = fs.readFileSync(
  path.join(projectRoot, "data", "escape-drive-body.html"),
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
  path.join(projectRoot, "public", "original-escape-drive.html"),
  combinedHtml,
  "utf8"
);

console.log(
  `Generated combined HTML for original-escape-drive.html (${combinedHtml.length} chars).`
);