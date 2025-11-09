import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "67-clicker-body.html"),
  "utf8"
);

export default function Clicker67Page() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}