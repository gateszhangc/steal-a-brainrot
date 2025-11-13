import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "about-us-body.html"),
  "utf8"
);

export default function AboutUsPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}