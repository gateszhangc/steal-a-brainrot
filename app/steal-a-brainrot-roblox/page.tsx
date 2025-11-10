import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-a-brainrot-roblox-body.html"),
  "utf8"
);

export default function StealABrainrotRobloxPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}