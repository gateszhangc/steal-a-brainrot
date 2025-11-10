import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "speed-per-click-obby-body.html"),
  "utf8"
);

export default function SpeedPerClickObbyPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}