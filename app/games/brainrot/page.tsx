import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "games-brainrot-body.html"),
  "utf8"
);

export default function GamesBrainrotPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
