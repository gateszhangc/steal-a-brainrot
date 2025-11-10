import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "escape-drive-body.html"),
  "utf8"
);

export default function EscapeDrivePage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}