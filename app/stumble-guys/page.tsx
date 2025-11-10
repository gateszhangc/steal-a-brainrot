import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "stumble-guys-body.html"),
  "utf8"
);

export default function StumbleGuysPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}