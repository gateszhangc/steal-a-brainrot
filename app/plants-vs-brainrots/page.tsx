import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "plants-vs-brainrots-body.html"),
  "utf8"
);

export default function PlantsVsBrainrotsPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}