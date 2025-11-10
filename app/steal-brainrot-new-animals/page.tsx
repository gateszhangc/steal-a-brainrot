import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-brainrot-new-animals-body.html"),
  "utf8"
);

export default function StealBrainrotNewAnimalsPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}