import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "slope-rider-body.html"),
  "utf8"
);

export default function SlopeRiderPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}