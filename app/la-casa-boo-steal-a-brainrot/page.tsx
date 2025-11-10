import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "la-casa-boo-steal-a-brainrot-body.html"),
  "utf8"
);

export default function LaCasaBooStealABrainrotPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}