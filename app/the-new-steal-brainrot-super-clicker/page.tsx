import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "the-new-steal-brainrot-super-clicker-body.html"),
  "utf8"
);

export default function TheNewStealBrainrotSuperClickerPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}