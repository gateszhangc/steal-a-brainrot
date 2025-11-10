import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-a-brainrot-99-nights-in-the-forest-body.html"),
  "utf8"
);

export default function StealABrainrot99NightsInTheForestPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}