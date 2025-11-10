import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-it-all-body.html"),
  "utf8"
);

export default function StealItAllPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}