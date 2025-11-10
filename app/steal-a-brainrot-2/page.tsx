import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-a-brainrot-2-body.html"),
  "utf8"
);

export default function StealABrainrot2Page() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}