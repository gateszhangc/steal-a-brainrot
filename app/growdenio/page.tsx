import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "growdenio-body.html"),
  "utf8"
);

export default function GrowdenioPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}