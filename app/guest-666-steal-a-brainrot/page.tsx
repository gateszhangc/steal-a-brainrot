import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "guest-666-steal-a-brainrot-body.html"),
  "utf8"
);

export default function Guest666StealABrainrotPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}