#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const headHtml = fs.readFileSync(
  path.join(projectRoot, "data", "steal-a-brainrot-99-nights-in-the-forest-head.html"),
  "utf8"
);
const bodyHtml = fs.readFileSync(
  path.join(projectRoot, "data", "steal-a-brainrot-99-nights-in-the-forest-body.html"),
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
  path.join(projectRoot, "public", "original-steal-a-brainrot-99-nights-in-the-forest.html"),
  combinedHtml,
  "utf8"
);

console.log(
  `Generated combined HTML for original-steal-a-brainrot-99-nights-in-the-forest.html (${combinedHtml.length} chars).`
);