import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "term-of-use-body.html"),
  "utf8"
);

export default function TermOfUsePage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}