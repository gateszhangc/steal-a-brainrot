import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "trade-or-grow-a-brainrot-body.html"),
  "utf8"
);

export default function TradeOrGrowABrainrotPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}