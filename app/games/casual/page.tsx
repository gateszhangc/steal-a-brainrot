import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "games-casual-body.html"),
  "utf8"
);

export default function GamesCasualPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}