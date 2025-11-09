import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "xlope-body.html"),
  "utf8"
);

export default function XlopePage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}