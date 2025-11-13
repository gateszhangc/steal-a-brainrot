import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "tag-online-body.html"),
  "utf8"
);

export default function TagOnlinePage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}