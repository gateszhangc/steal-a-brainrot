import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "plants-vs-zombies-replanted-body.html"),
  "utf8"
);

export default function PlantsVsZombiesReplantedPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}