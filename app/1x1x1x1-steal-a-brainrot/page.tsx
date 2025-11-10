import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "1x1x1x1-steal-a-brainrot-body.html"),
  "utf8"
);

export default function X1x1x1StealABrainrot() {
  return (
    <main
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}