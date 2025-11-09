import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "2v2io-body.html"),
  "utf8"
);

export default function V2VioPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}